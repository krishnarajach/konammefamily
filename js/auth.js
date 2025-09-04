// Authentication module
const Auth = (function() {
    // Hard-coded login credentials
    const ADMIN_USER = { username: 'admin', password: 'admin123' };
    
    // DOM elements
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const submitLoginBtn = document.getElementById('submit-login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const userInfo = document.getElementById('user-info');
    const adminPanel = document.getElementById('admin-panel');
    
    let currentUser = null;
    
    function init() {
        // Set up event listeners
        loginBtn.addEventListener('click', showLoginModal);
        logoutBtn.addEventListener('click', handleLogout);
        submitLoginBtn.addEventListener('click', handleLogin);
        
        // Check if user was previously logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUserInterface();
        }
    }
    
    function showLoginModal() {
        loginModal.style.display = 'block';
    }
    
    function handleLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
            currentUser = {
                username: username,
                isAdmin: true
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            Modals.closeModal();
        } else {
            alert('ಅಮಾನ್ಯ ಬಳಕೆಯರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಡಿಲ್ಲಿಲ್ಲ');
        }
    }
    
    function updateUserInterface() {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userInfo.textContent = `ಸುಸ್ವಾಗತ, ${currentUser.username}`;
        logoutBtn.classList.remove('hidden');
        adminPanel.classList.remove('hidden');
        Admin.renderRequests();
        
        // Re-render tree with updated permissions
        Tree.renderTree();
    }
    
    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        adminPanel.classList.add('hidden');
        
        Tree.renderTree();
    }
    
    function getCurrentUser() {
        return currentUser;
    }
    
    function isLoggedIn() {
        return currentUser !== null;
    }
    
    return {
        init,
        getCurrentUser,
        isLoggedIn
    };
})();