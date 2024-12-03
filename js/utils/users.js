// User IDs constants
export const OSCAR_ID = 'dJn3WVAmUYNFt25RNu3oZ3Frhwh2';
export const YURITZI_ID = '1QAxWlZQGbMBIQtGFZZnH4B2EjB3';

export const getUserName = (userId) => {
  switch (userId) {
    case OSCAR_ID:
      return 'Oscar';
    case YURITZI_ID:
      return 'Yuritzi';
    default:
      return 'Usuario Desconocido';
  }
};

export const isValidUser = (userId) => {
  return userId === OSCAR_ID || userId === YURITZI_ID;
};