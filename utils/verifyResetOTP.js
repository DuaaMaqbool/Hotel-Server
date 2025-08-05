export const verifyResetOTP = (user, otp) => {
  if (!user) return { valid: false, message: "User not found", code: 404 };

  if (user.resetOTP !== otp)
    return { valid: false, message: "Invalid OTP", code: 400 };

  if (!user.resetOTPExpiry || Date.now() > user.resetOTPExpiry)
    return { valid: false, message: "OTP expired", code: 400 };

  return { valid: true };
};
