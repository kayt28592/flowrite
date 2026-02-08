// ============================================
// 🔐 AUTHENTICATION HANDLERS
// ============================================

let currentUser = null;

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
});

async function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (!token) {
        showLoginScreen();
        return;
    }

    try {
        const response = await api.get(API_CONFIG.ENDPOINTS.GET_USER);
        currentUser = response.data;
        showMainApp();
    } catch (error) {
        console.error('Auth check failed:', error);
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info
    document.getElementById('userRole').textContent = currentUser.email;
    
    // Show all tabs
    document.getElementById('submissionsTab').style.display = 'block';
    document.getElementById('customersTab').style.display = 'block';
    document.getElementById('itemsTab').style.display = 'block';
    
    // Load initial data
    loadCustomers();
    loadSubmissions();
    loadItems();
}

// Auth tab switching
function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginTabBtn');
    const registerBtn = document.getElementById('registerTabBtn');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
        loginBtn.style.background = 'var(--accent)';
        loginBtn.style.color = 'white';
        registerBtn.style.background = 'white';
        registerBtn.style.color = 'var(--gray)';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
        loginBtn.style.background = 'white';
        loginBtn.style.color = 'var(--gray)';
        registerBtn.style.background = 'var(--accent)';
        registerBtn.style.color = 'white';
    }
}

// Login handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('loginErrorMsg');
    
    try {
        const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password }, { skipAuth: true });
        
        // Save token and user
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        
        currentUser = response.data.user;
        errorDiv.style.display = 'none';
        
        showMainApp();
    } catch (error) {
        errorMsg.textContent = error.message || 'Invalid email or password';
        errorDiv.style.display = 'block';
    }
});

// Register handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    const errorDiv = document.getElementById('registerError');
    const errorMsg = document.getElementById('registerErrorMsg');
    const successDiv = document.getElementById('registerSuccess');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    try {
        await api.post(API_CONFIG.ENDPOINTS.REGISTER, { email, password }, { skipAuth: true });
        
        errorDiv.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Clear form
        e.target.reset();
        
        // Switch to login tab after 2 seconds
        setTimeout(() => {
            showAuthTab('login');
            successDiv.style.display = 'none';
        }, 2000);
    } catch (error) {
        errorMsg.textContent = error.message || 'Registration failed';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
    }
});

// Logout handler
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    currentUser = null;
    window.location.reload();
});

function resetPassword() {
    alert('Password reset feature coming soon! Please contact support.');
}

// Export for use in other files
window.currentUser = () => currentUser;
window.showAuthTab = showAuthTab;
window.resetPassword = resetPassword;
