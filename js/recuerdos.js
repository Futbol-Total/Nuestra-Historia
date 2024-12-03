import { auth, db, storage } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { logoutUser } from './utils/auth.js';
import { getUserName } from './utils/users.js';

const galeriaContainer = document.getElementById('galeriaRecuerdos');
const imagenInput = document.getElementById('imagenRecuerdo');
const descripcionInput = document.getElementById('descripcionRecuerdo');
const subirRecuerdo = document.getElementById('subirRecuerdo');
const logoutBtn = document.getElementById('logoutBtn');

const q = query(collection(db, 'recuerdos'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
    galeriaContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const recuerdo = doc.data();
        const div = document.createElement('div');
        div.className = 'recuerdo-card';
        div.innerHTML = `
            <img src="${recuerdo.imageUrl}" alt="Recuerdo" class="recuerdo-imagen">
            <p class="recuerdo-autor">${getUserName(recuerdo.userId)}</p>
            <p class="recuerdo-descripcion">${recuerdo.descripcion}</p>
            <span class="recuerdo-fecha">${recuerdo.timestamp?.toDate().toLocaleString()}</span>
        `;
        galeriaContainer.appendChild(div);
    });
});

subirRecuerdo.addEventListener('click', async () => {
    if (!imagenInput.files[0] || !descripcionInput.value.trim()) return;
    
    try {
        const file = imagenInput.files[0];
        const storageRef = ref(storage, `recuerdos/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);
        
        await addDoc(collection(db, 'recuerdos'), {
            userId: auth.currentUser.uid,
            imageUrl,
            descripcion: descripcionInput.value,
            timestamp: serverTimestamp()
        });
        
        imagenInput.value = '';
        descripcionInput.value = '';
    } catch (error) {
        console.error('Error al subir recuerdo:', error);
    }
});

logoutBtn.addEventListener('click', async () => {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = '/index.html';
    }
});