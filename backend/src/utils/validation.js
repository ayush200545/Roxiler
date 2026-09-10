const VALID_ROLES = ['ADMIN', 'NORMAL_USER', 'STORE_OWNER'];

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) => {
  // 8-16 characters, at least 1 uppercase, at least 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  return passwordRegex.test(password);
};

const validateUserData = (name, email, password, address, { requirePassword = true, role } = {}) => {
  if (!name || name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters long.';
  }
  if (!email || !isValidEmail(email)) {
    return 'Please provide a valid email address.';
  }
  if (requirePassword && (!password || !isValidPassword(password))) {
    return 'Password must be 8-16 characters, include at least one uppercase letter and one special character.';
  }
  if (!address || address.length > 400) {
    return 'Address is required and must be less than 400 characters.';
  }
  if (role && !VALID_ROLES.includes(role)) {
    return 'Role must be ADMIN, NORMAL_USER, or STORE_OWNER.';
  }
  return null;
};

const validateStoreData = (name, email, address) => {
  if (!name || name.trim().length < 1 || name.length > 60) {
    return 'Store name is required and must be at most 60 characters.';
  }
  if (!email || !isValidEmail(email)) {
    return 'Please provide a valid store email address.';
  }
  if (!address || address.length > 400) {
    return 'Address is required and must be less than 400 characters.';
  }
  return null;
};

const textContains = (value) => ({ contains: value, mode: 'insensitive' });

const sortDirection = (order) => (order === 'desc' ? 'desc' : 'asc');

const compareValues = (a, b, order = 'asc') => {
  const dir = order === 'desc' ? -1 : 1;
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * dir;
  }
  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' }) * dir;
};

module.exports = {
  VALID_ROLES,
  isValidEmail,
  isValidPassword,
  validateUserData,
  validateStoreData,
  textContains,
  sortDirection,
  compareValues
};
