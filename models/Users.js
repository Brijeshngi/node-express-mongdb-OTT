import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
  Email: {
    type: String,
    required: [true, "Please Enter your Email"],
  },
  Contact: {
    type: Number,
    required: [true, "Please Enter your Contact"],
    minlength: [10, "Please Enter 10 digit of your contact"],
    maxlength: [10, "Please Enter 10 digit of your contact"],
  },
  isEmailVerified: { type: Boolean, default: false },
  // Track email verification status.

  isPhoneVerified: { type: Boolean, default: false },
  // Track phone verification status.

  loginAttempts: { type: Number, default: 0 },
  //  Helps prevent brute- force attacks.

  lockUntil: { type: Date, default: null },
  // Lock user if login attempts exceed limits.

  Username: {
    type: String,
  },
  Password: {
    type: String,
    select: false,
    required: [true, "Please Enter your Password"],
    minlength: [8, "Password must be of 8 characters"],
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  ProfilePicture: {
    url: {
      type: String,
    },
  },
  Role: {
    type: String,
    enum: ["Admin", "user"],
    default: "user",
  },
  devices: [
    {
      device_id: {
        type: String,
      },
      deviceType: {
        type: String,
      },
      last_login: {
        type: Date,
      },
    },
  ],
  Subscriptions: {
    subscriptionPlan: {
      subscriptionDuration: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
      },
      subscriptionPlanType: {
        type: String,
        enum: ["free", "basic", "super", "premium"],
      },
    },
    subscriptionStatus: {
      type: String,
      enum: ["Active", "Inactive"],
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionExpiry: {
      type: String,
    },
  },
  ContentBrowsing: [
    {
      ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contents",
      },
    },
  ],
  WatchList: [
    {
      ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contents",
      },
    },
  ],
  Ratings: [
    {
      ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contents",
      },
      contentRating: {
        type: Number,
      },
    },
  ],
  Reviews: [
    {
      ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contents",
      },
      contentReviews: {
        type: String,
      },
    },
  ],
  languagePreference: {
    type: String,
    enum: ["English", "Hindi", "Spanish", "French"],
    default: "English",
  },

  // Stores user's preferred UI language.
  themePreference: { type: String, enum: ["Light", "Dark"], default: "Light" },

  // Stores user's theme setting.
  watchHistory: [
    {
      ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
      watchedDuration: {
        type: String,
      },
      lastWatched: {
        type: Date,
      },
    },
  ],
  // Track user’s watch history for resume watching feature
  LastLogin: {
    type: String,
    default: Date.now(),
  },
  AccountStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  CreatedAt: {
    type: String,
    default: Date.now(),
  },
  ResetPasswordToken: String,
  ResetPasswordTokenExpire: String,
});

schema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();

  // console.log("Hashing password:", this.Password); // Debugging
  this.Password = await bcrypt.hash(this.Password, 10);

  // console.log("Hashed password:", this.Password); // Debugging
  next();
});

schema.methods.comparePassword = async function (Password) {
  return await bcrypt.compare(Password, this.Password);
};

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.ResetPasswordToken = crypto
    .createHash("SHA256")
    .update(resetToken)
    .digest("hex");

  this.ResetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", schema);
