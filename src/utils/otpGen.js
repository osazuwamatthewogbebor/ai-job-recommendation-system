export const getOtp = () => {
   return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiryTime = (otpTimeMins = 5) => {
  const now = new Date();
  return new Date(now.getTime() + Number(otpTimeMins) * 60 * 1000);
};