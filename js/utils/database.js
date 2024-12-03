import { db } from '../firebase-config.js';
import { collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export const createMessage = async (userId, content) => {
  try {
    const mensajesRef = collection(db, 'mensajes');
    await addDoc(mensajesRef, {
      userId,
      contenido: content,
      timestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMensajesQuery = () => {
  const mensajesRef = collection(db, 'mensajes');
  return query(mensajesRef, orderBy('timestamp', 'desc'));
};