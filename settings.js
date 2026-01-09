/* ====================================
   Settings Page JavaScript
   ==================================== */

/* ====================================
   Settings Functions
   ==================================== */

// Handle theme toggle
function handleThemeToggle() {
    toggleTheme();
}

// Handle clear data
function handleClearData() {
    if (confirm('Are you sure you want to delete all posts and reset settings? This cannot be undone.')) {
        clearAllData();
        applyTheme('light');

        // Update toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = false;
        }

        alert('All data has been cleared!');

        // Redirect to home
        window.location.href = 'index.html';
    }
}

// Calculate storage used
function calculateStorage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2; // UTF-16 uses 2 bytes per character
        }
    }
    const kb = (total / 1024).toFixed(2);
    const mb = (total / (1024 * 1024)).toFixed(2);
    document.getElementById('storageUsed').textContent = total > 1024 * 1024
        ? `${mb} MB used`
        : `${kb} KB used`;
}

// Export data
function exportData() {
    const posts = localStorage.getItem('socialapp_posts') || '[]';
    const user = localStorage.getItem('socialapp_user') || '{}';
    const settings = localStorage.getItem('socialapp_settings') || '{}';

    const data = {
        posts: JSON.parse(posts),
        user: JSON.parse(user),
        settings: JSON.parse(settings),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'socialapp_export.json';
    a.click();
    URL.revokeObjectURL(url);
}

/* ====================================
   Page Initialization
   ==================================== */

// Initialize settings page
function initSettingsPage() {
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = getTheme() === 'dark';
        themeToggle.addEventListener('change', handleThemeToggle);
    }

    // Set up clear data button
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', handleClearData);
    }

    // Calculate initial storage
    calculateStorage();
}

/* ====================================
   Document Ready
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
    initSettingsPage();
});
