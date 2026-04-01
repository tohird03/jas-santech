export const regexPhoneNumber = new RegExp(/^998(\d{9})$/);
export const regexPassword = new RegExp(
  '^(?=(.*[0-9]))(?=.*[!@#$%^&*()\\\\[\\]{}\\-_+=~`|:;"\'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,16}$'
);
export const regexHomeworkFile = new RegExp('.(\\w+)$');
