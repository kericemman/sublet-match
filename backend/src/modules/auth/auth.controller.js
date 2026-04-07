const catchAsync = require("../../utils/catchAsync");
const authService = require("./auth.service");

const register = catchAsync(async (req, res) => {
  const result = await authService.registerLandlord(req.body);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.loginLandlord(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

// const googleLogin = catchAsync(async (req, res) => {
//   const result = await authService.loginWithGoogle(req.body.token);

//   res.status(200).json({
//     success: true,
//     message: "Google authentication successful",
//     data: result,
//   });
// });

const googleLogin = catchAsync(async (req, res) => {
  const googleToken = req.body.token;


  const result = await authService.loginWithGoogle(googleToken);

  res.status(200).json({
    success: true,
    message: "Google authentication successful",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetPassword(req.body);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const me = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  me,
};