import { auth, db } from 'firebase-config.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { logoutUser } from 'utils/auth.js';
import { getUserName } from 'utils/users.js';

const entradasContainer = document.getElementById('entradasDiario');
const tituloDiario = document.getElementById('tituloDiario');
const contenidoDiario = document.getElementById('contenidoDiario');
const guardarEntrada = document.getElementById('guardarEntrada');
const logoutBtn = document.getElementById('logoutBtn');

const q = query(collection(db, 'diario'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
    entradasContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const entrada = doc.data();
        const div = document.createElement('div');
        div.className = 'entrada-card';
        div.innerHTML = `
            <h3 class="entrada-titulo">${entrada.titulo}</h3>
            <p class="entrada-autor">${getUserName(entrada.userId)}</p>
            <p class="entrada-contenido">${entrada.contenido}</p>
            <span class="entrada-fecha">${entrada.timestamp?.toDate().toLocaleString()}</span>
        `;
        entradasContainer.appendChild(div);
    });
});

guardarEntrada.addEventListener('click', async () => {
    if (!tituloDiario.value.trim() || !contenidoDiario.value.trim()) return;
    
    try {
        await addDoc(collection(db, 'diario'), {
            userId: auth.currentUser.uid,
            titulo: tituloDiario.value,
            contenido: contenidoDiario.value,
            timestamp: serverTimestamp()
        });
        tituloDiario.value = '';
        contenidoDiario.value = '';
    } catch (error) {
        console.error('Error al guardar entrada:', error);
    }
});

logoutBtn.addEventListener('click', async () => {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = 'index.html';
    }
});