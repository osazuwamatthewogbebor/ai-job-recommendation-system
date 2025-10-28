export const getOtp = () => {
   return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiryTime = (minutes = 5) => {
  const now = new Date();
  return new Date(now.getTime() + Nummber(minutes) * 60 * 1000);
};