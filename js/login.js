import { loginUser } from './utils/auth.js';

const loginBtn = document.getElementById('loginBtn');
const username = document.getElementById('username');
const password = document.getElementById('password');
const errorMessage = document.createElement('div');

errorMessage.className = 'error-message';
document.querySelector('.login-form').appendChild(errorMessage);

const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.opacity = '1';
    setTimeout(() => {
        errorMessage.style.opacity = '0';
    }, 3000);
};

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!username.value.trim() || !password.value.trim()) {
        showError('Por favor, completa todos los campos');
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';

    const result = await loginUser(username.value, password.value);
    
    if (result.success) {
        window.location.href = '/home.html';
    } else {
        showError(result.error);
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar al Amor';
    }
});

// Allow Enter key to submit
[username, password].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !loginBtn.disabled) {
            loginBtn.click();
        }
    });
});