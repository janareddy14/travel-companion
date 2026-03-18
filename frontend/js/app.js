// ==========================================
// Travel Companion – App Core (Navbar, Theme, Toast)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTheme();
    initScrollAnimations();
    updateAuthUI();
});

// === Navbar ===
function initNavbar() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('active'));
    }

    // Scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link =>
        link.addEventListener('click', () => links?.classList.remove('active'))
    );
}

// === Dark Mode ===
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    });

    // Set initial icon
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// === Scroll Animations ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// === Auth UI ===
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const authLinks = document.querySelectorAll('.auth-link');
    const guestLinks = document.querySelectorAll('.guest-link');
    const userNameEls = document.querySelectorAll('.user-name');

    if (token && user) {
        authLinks.forEach(el => el.style.display = '');
        guestLinks.forEach(el => el.style.display = 'none');
        userNameEls.forEach(el => el.textContent = user.username);
    } else {
        authLinks.forEach(el => el.style.display = 'none');
        guestLinks.forEach(el => el.style.display = '');
    }
}

// === Toast Notifications ===
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// === Loading ===
function showLoading() {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.classList.remove('active');
}

// === Logout ===
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully');
    setTimeout(() => window.location.href = 'index.html', 500);
}

// === Utilities ===
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

function requireAuth() {
    if (!isLoggedIn()) {
        showToast('Please login to continue', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return false;
    }
    return true;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
