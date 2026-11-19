const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (value) => emailPattern.test(String(value).trim());
