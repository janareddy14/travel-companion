// ==========================================
// Travel Companion – Auth (Login & Register)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
});

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        showLoading();
        const data = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            userId: data.userId,
            username: data.username,
            email: data.email,
            role: data.role
        }));
        showToast('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = data.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
        }, 1000);
    } catch (err) {
        showToast('Invalid username or password', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        showLoading();
        const data = await api.post('/auth/register', { username, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            userId: data.userId,
            username: data.username,
            email: data.email,
            role: data.role
        }));
        showToast('Registration successful! Welcome aboard!');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } catch (err) {
        showToast('Registration failed. Username or email may be taken.', 'error');
    } finally {
        hideLoading();
    }
}
