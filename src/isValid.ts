export const isValidEmail = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export const isValidAvatar = (avatar: string) => {
  const avatarRegex = /^https:\/\/.*\.(img|png|jpg|jpeg|gif|bmp|webp|svg|tif|tiff|ico|jpe|jfif|jp2|j2k|jpf|jpx|jpm|mj2|pdf)$/i;
  return avatarRegex.test(avatar);
};
