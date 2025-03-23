import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";
import ErrorHandle from "../utils/errorHandle.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const isAuthenticated = catchAsyncError(
  async (request, response, next) => {
    const { token } = request.cookies;

    if (!token) return next(new ErrorHandle("Not logged-in", 400));

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    request.user = await User.findById(decodedUser._id);

    // console.log(request.user);// logged-in user data

    next();
  }
);
export const checkDevice = catchAsyncError(async (request, response, next) => {
  const device_id = "xxxxx";
  const data = request.user.devices.filter(
    (deviceID) => deviceID.device_id === device_id
  );
  console.log(data);
  if (!(data.length == 1))
    return next(new ErrorHandle("Please log-in Again bhai", 403));
  next();
});

export const isAdmin = catchAsyncError(async (request, response, next) => {
  if (request.user.Role === "user")
    return next(
      new ErrorHandle(`${request.user.FirstName}, Access Denied for user`, 403)
    );
  next();
});

export const isUser = catchAsyncError(async (request, response, next) => {
  if (request.user.Role === "Admin")
    return next(
      new ErrorHandle(`${request.user.FirstName}, Access Denied fir admin`, 403)
    );
  next();
});
