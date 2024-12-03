import { auth } from '../firebase-config.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const loginUser = async (username, password) => {
  try {
    // Map usernames to their corresponding emails
    const emailMap = {
      'oscar': 'oscar@amor.com',
      'yuritzi': 'yuritzi@amor.com'
    };

    const email = emailMap[username.toLowerCase()];
    if (!email) {
      return { success: false, error: 'Usuario no válido' };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verify user ID matches either Oscar or Yuritzi
    const validUserIds = ['dJn3WVAmUYNFt25RNu3oZ3Frhwh2', '1QAxWlZQGbMBIQtGFZZnH4B2EjB3'];
    if (!validUserIds.includes(userCredential.user.uid)) {
      await signOut(auth);
      return { success: false, error: 'Usuario no autorizado' };
    }

    return { success: true };
  } catch (error) {
    let errorMessage = 'Error al iniciar sesión';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico no válido';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al cerrar sesión' };
  }
};