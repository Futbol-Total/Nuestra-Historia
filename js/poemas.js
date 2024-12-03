import { auth, db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { logoutUser } from './utils/auth.js';
import { getUserName } from './utils/users.js';

const poemasContainer = document.getElementById('listaPoemas');
const nuevoPoema = document.getElementById('nuevoPoema');
const publicarPoema = document.getElementById('publicarPoema');
const logoutBtn = document.getElementById('logoutBtn');

const q = query(collection(db, 'poemas'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
    poemasContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const poema = doc.data();
        const div = document.createElement('div');
        div.className = 'poema-card';
        div.innerHTML = `
            <p class="poema-autor">${getUserName(poema.userId)}</p>
            <p class="poema-contenido">${poema.contenido}</p>
            <span class="poema-fecha">${poema.timestamp?.toDate().toLocaleString()}</span>
        `;
        poemasContainer.appendChild(div);
    });
});

publicarPoema.addEventListener('click', async () => {
    if (!nuevoPoema.value.trim()) return;
    
    try {
        await addDoc(collection(db, 'poemas'), {
            userId: auth.currentUser.uid,
            contenido: nuevoPoema.value,
            timestamp: serverTimestamp()
        });
        nuevoPoema.value = '';
    } catch (error) {
        console.error('Error al publicar poema:', error);
    }
});

logoutBtn.addEventListener('click', async () => {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = '/index.html';
    }
});