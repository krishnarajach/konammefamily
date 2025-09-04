// Main application module
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Auth.init();
    Sidebar.init();
    Tree.init();
    Modals.init();
    Admin.init();
    
    // Render sub-families in sidebar
    Sidebar.renderSubFamilies();
    
    // Make the login modal accessible from auth module
    Auth.showLoginModal = function() {
        document.getElementById('login-modal').style.display = 'block';
    };
});