import { auth } from 'firebase-config.js';
import { onSnapshot } from 'firebase/firestore';
import { createMessage, getMensajesQuery } from 'utils/database.js';
import { logoutUser } from 'utils/auth.js';
import { getUserName } from 'utils/users.js';

const mensajesContainer = document.getElementById('mensajesContainer');
const nuevoMensaje = document.getElementById('nuevoMensaje');
const enviarMensaje = document.getElementById('enviarMensaje');
const logoutBtn = document.getElementById('logoutBtn');

// Escuchar mensajes en tiempo real
const q = getMensajesQuery();
onSnapshot(q, (snapshot) => {
    mensajesContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const mensaje = doc.data();
        const div = document.createElement('div');
        div.className = 'mensaje';
        div.innerHTML = `
            <p class="mensaje-autor">${getUserName(mensaje.userId)}</p>
            <p class="mensaje-contenido">${mensaje.contenido}</p>
            <span class="mensaje-fecha">${mensaje.timestamp?.toDate().toLocaleString()}</span>
        `;
        mensajesContainer.appendChild(div);
    });
});

// Enviar nuevo mensaje
enviarMensaje.addEventListener('click', async () => {
    if (!nuevoMensaje.value.trim()) return;
    
    const result = await createMessage(auth.currentUser.uid, nuevoMensaje.value);
    if (result.success) {
        nuevoMensaje.value = '';
    } else {
        console.error('Error al enviar mensaje:', result.error);
    }
});

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = 'index.html';
    } else {
        console.error('Error al cerrar sesión:', result.error);
    }
});