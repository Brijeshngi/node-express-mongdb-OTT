import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { User } from "../models/Users.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { Content } from "../models/Content.js";
export const createUser = catchAsyncError(async (request, response, next) => {
  const { FirstName, LastName, Email, Contact, Password } = request.body;

  if (!Email || !Contact || !Password)
    return next(new ErrorHandle("Please provide all details", 400));
  let user = await User.findOne({ Email });
  if (user) return next(new ErrorHandle("User already exists", 400));

  user = await User.create({
    FirstName,
    LastName,
    Email,
    Contact,
    Password,
  });

  response.status(201).json({
    success: true,
    message: "Your Profile has been created Successfully",
  });
});
export const createAdmin = catchAsyncError(async (request, response, next) => {
  const { FirstName, LastName, Email, Contact, Password } = request.body;

  if (!Email || !Contact || !Password)
    return next(new ErrorHandle("Please provide all details", 400));
  let user = await User.findOne({ Email });
  if (user) return next(new ErrorHandle("User already exists", 400));

  user = await User.create({
    FirstName,
    LastName,
    Email,
    Contact,
    Password,
    Role: "Admin",
  });

  response.status(201).json({
    success: true,
    message: "Your Admin profile has been created Successfully",
  });
});

// refresh token, access token
// multi device with restricted number of device login

export const login = catchAsyncError(async (request, response, next) => {
  const { Email, Password, device_id, deviceType } = request.body;

  if (!Email || !Password)
    return next(new ErrorHandle("Please Enter All field", 400));

  const user = await User.findOne({ Email }).select("+Password");

  if (!user) return next(new ErrorHandle("Incorrect Email and Password", 401));

  const isMatch = await user.comparePassword(Password);

  if (!isMatch)
    return next(new ErrorHandle("Incorrect Email or Password", 401));

  if (user.devices.length >= 5)
    return next(
      new ErrorHandle("Number of devices registered limit exceeded", 403)
    );

  let devicesCheck = user.devices || [];
  // check if device already logged in devices or not
  let activeToken = user.getJWTToken();

  console.log(devicesCheck.length);
  console.log("Current devices:", user.devices);
  console.log("Checking for device_id:", device_id);

  // Check if the device already exists
  const existingDeviceIndex = devicesCheck.findIndex(
    (device) => String(device.device_id) === String(device_id)
  );

  console.log("existingDeviceIndex:", existingDeviceIndex);

  if (existingDeviceIndex !== -1) {
    // If device exists, update the token
    user.devices[existingDeviceIndex].activeToken = activeToken;
  } else {
    // If device does not exist, add it safely
    user.devices.push({
      device_id,
      deviceType,
      activeToken,
    });
  }

  user.devices = devicesCheck;
  await user.save();
  sendToken(response, user, 200);
});

export const getMyProfile = catchAsyncError(async (request, response, next) => {
  const myProfile = await User.findById(request.user._id);

  if (!myProfile) return next(new ErrorHandle("Please login", 404));

  response.status(200).json({
    myProfile,
  });
});

export const getAllUsers = catchAsyncError(async (request, response, next) => {
  const allUsers = await User.find({});

  if (!allUsers) return next(new ErrorHandle("No users found", 404));

  response.status(200).json({
    allUsers,
  });
});

export const uploadProfilePicture = catchAsyncError(
  async (request, response, next) => {
    const file = request.file;
    if (!file) return next(new ErrorHandle("No image found", 404));

    console.log(file);
    // AWS S3 credentials

    const S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    console.log("AWS Access Key:", process.env.AWS_ACCESS_KEY_ID);
    console.log("AWS Secret Key:", process.env.AWS_SECRET_ACCESS_KEY);
    console.log("AWS Region:", process.env.AWS_REGION);
    console.log("S3 Bucket:", process.env.S3_BUCKET_NAME);

    const bucketName = process.env.S3_BUCKET_NAME;
    const fileName = `${Date.now()}-${request.file.originalname}`;
    console.log("hello start");
    const Filexists = await User.findById(request.user._id);
    const checkfile = Filexists.ProfilePicture.url;
    if (checkfile) return next(new ErrorHandle("File Already Exists", 403));
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make file publicly accessible
    };

    await S3.send(new PutObjectCommand(params));
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log(fileUrl);
    let user = await User.findById(request.user._id);
    console.log("hello");
    user.ProfilePicture = {
      url: fileUrl,
    };
    console.log("hello two");

    await user.save();
    console.log("hello final");

    response.status(200).json({ message: "File uploaded successfully", user });
  }
);

export const updateProfilePicture = catchAsyncError(
  async (request, response, next) => {
    const file = request.file;
    if (!file) return next(new ErrorHandle("No image found", 404));

    console.log(file);
    // AWS S3 credentials

    const S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const bucketName = process.env.S3_BUCKET_NAME;
    const fileName = `${Date.now()}-${request.file.originalname}`;
    console.log("hello start");
    const Filexists = await User.findById(request.user._id);
    const checkfile = Filexists.ProfilePicture.url;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make file publicly accessible
    };
    await S3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: checkfile,
      })
    );
    await S3.send(new PutObjectCommand(params));
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log(fileUrl);
    let user = await User.findById(request.user._id);
    console.log("hello");
    user.ProfilePicture = {
      url: fileUrl,
    };
    console.log("hello two");

    await user.save();
    console.log("hello final");

    response.status(200).json({ message: "File uploaded successfully", user });
  }
);

export const changePassword = catchAsyncError(
  async (request, response, next) => {
    const { oldPassword, newPassword } = request.body;

    if (!oldPassword || !newPassword)
      return next(new ErrorHandle("Please provide passwords", 404));

    const user = await User.findById(request.user._id).select("+Password");

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch)
      return next(new ErrorHandle("Please provide correct passowrds", 401));

    user.Password = newPassword;

    await user.save();

    response.status(200).json({
      success: true,
      message: "Password changed successfully",
      user,
    });
  }
);

export const forgetPassword = catchAsyncError(
  async (request, response, next) => {
    const { Email } = request.body;

    if (!Email) return next(new ErrorHandle("Please provide Email", 401));

    const user = await User.findOne({ Email });

    if (!user) return next(new ErrorHandle("No user found", 404));

    const resetToken = await user.getResetToken();
    console.log("Generated Token:", resetToken);
    console.log("Hashed Token to Store:", user.ResetPasswordToken);
    console.log("Expires At:", new Date(user.ResetPasswordTokenExpire));

    await user.save({ validateBeforeSave: false });

    response.status(200).json({
      success: true,
      message: "Please login to your email to find reset link",
      resetToken,
    });
  }
);

export const resetPassword = catchAsyncError(
  async (request, response, next) => {
    const { token } = request.params;
    const ResetPasswordToken = crypto
      .createHash("SHA256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      ResetPasswordToken,
      ResetPasswordTokenExpire: {
        $gt: Date.now(),
      },
    });
    console.log(user);
    if (!user) return next(new ErrorHandle("Token has been Expired", 401));

    user.Password = request.body.Password;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordTokenExpire = undefined;

    await user.save();

    response.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  }
);

export const logout = catchAsyncError(async (request, response, next) => {
  const user = await User.findById(request.user._id);

  user.LastLogin;
  console.log(user.LastLogin);
  user.save();

  response
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true, // ✅ Prevents XSS attacks
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Logged-out successfully",
    });
});

export const deleteUser = catchAsyncError(async (request, response, next) => {
  const { id } = request.params;

  const userToDelete = await User.findByIdAndDelete(id);

  if (!userToDelete) return next(new ErrorHandle("User not found"), 404);

  response.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});

export const selfDeleteUser = catchAsyncError(
  async (request, response, next) => {
    const userData = await User.findById(request.user._id);
    if (!userData) return next(new ErrorHandle("no user found", 404));

    await userData.deleteOne();

    response.status(200).json({
      success: true,
      message: "Your Profile deleted successfully",
    });
  }
);

// contentBasedOnSubscription Description: Fetch content accessible based on user’s subscription plan.

export const getContentOnsubcriptionPlan = catchAsyncError(
  async (request, response, next) => {
    const _id = "67cb24c799fdadc59e5c970a";
    const userData = await User.findById(_id);
    const planData =
      userData.Subscriptions.subscriptionPlan.subscriptionPlanType;
    if (!planData == "premium")
      return next(new ErrorHandle("not allowed", 403));
    const contentDataOnPlan = await Content.find(
      {
        "trailer.url": { $exists: true, $ne: null },
      },
      { "trailer.url": 1, _id: 0 }
    );

    response.status(200).json({
      success: true,
      contentDataOnPlan,
    });
  }
);

// POST /api/auth/logout/all → Logout from all devices.
// POST /api/auth/logout/all → Logout from one device.

export const updateDevice = catchAsyncError(async (request, response, next) => {
  await User.updateOne(
    { _id: "67cb24c799fdadc59e5c970a" }, // Replace with actual user ID
    {
      $set: {
        devices: [],
      },
    }
  );

  response.status(200).json({
    success: true,
  });
});

// upgradeSubscription
// POST /api/user/subscription/cancel → Cancel subscription.

// resumeWatching Description: Retrieve the last watched position for a user Method: GET /api/user/watch-history/:contentId
// interesting

// contentRecommendation Method: GET /api/user/recommendations

// create a user pool at real time watching users to know and display on live streaming
// use of in-memory

// GET /api/auth/oauth/callback → Handle OAuth authentication callback.
// 0Auth and social login further
