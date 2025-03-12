export const sendToken = (response, user, message, statusCode = 200) => {
  if (!user) {
    return response.status(400).json({
      success: false,
      message: "Invalid user, cannot generate token",
    });
  }
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
  };

  return response.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message: "Logged-in Successfully",
  });
};
