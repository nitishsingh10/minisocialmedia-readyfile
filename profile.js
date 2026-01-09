/* ====================================
   Profile Page JavaScript
   ==================================== */

/* ====================================
   Profile Functions
   ==================================== */

// Load user profile and update UI
function loadUserProfile() {
    const user = getUser();

    // Update profile page elements
    const profileName = document.getElementById('profileName');
    const profileHandle = document.getElementById('profileHandle');
    const profileAvatarImage = document.getElementById('profileAvatarImage');
    const profileAvatarInitial = document.getElementById('profileAvatarInitial');

    if (profileName) profileName.textContent = user.name || 'User';
    if (profileHandle) profileHandle.textContent = user.handle || '@user';

    if (user.avatar && profileAvatarImage) {
        profileAvatarImage.src = user.avatar;
        profileAvatarImage.style.display = 'block';
        if (profileAvatarInitial) profileAvatarInitial.style.display = 'none';
    } else if (profileAvatarInitial) {
        profileAvatarInitial.textContent = (user.name || 'U').charAt(0).toUpperCase();
        profileAvatarInitial.style.display = 'block';
        if (profileAvatarImage) profileAvatarImage.style.display = 'none';
    }

    // Show/hide remove avatar button
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    if (removeAvatarBtn) {
        removeAvatarBtn.style.display = user.avatar ? 'flex' : 'none';
    }

    // Update edit modal fields
    const editName = document.getElementById('editName');
    const editHandle = document.getElementById('editHandle');
    const editBio = document.getElementById('editBio');

    if (editName) editName.value = user.name || '';
    if (editHandle) editHandle.value = (user.handle || '@user').replace('@', '');
    if (editBio) editBio.value = user.bio || '';
}

// Handle avatar change
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const user = getUser();
        user.avatar = e.target.result;
        saveUser(user);
        loadUserProfile();
        updateAvatarDisplay();
    };
    reader.readAsDataURL(file);
}

// Handle avatar removal
function handleRemoveAvatar() {
    const user = getUser();
    user.avatar = null;
    saveUser(user);
    loadUserProfile();
    updateAvatarDisplay();
}

// Open edit profile modal
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.add('active');
        loadUserProfile(); // Refresh data in form
    }
}

// Close edit profile modal
function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Save profile changes
function saveProfile() {
    const editName = document.getElementById('editName');
    const editHandle = document.getElementById('editHandle');
    const editBio = document.getElementById('editBio');

    const user = getUser();

    if (editName) user.name = editName.value.trim() || 'User';
    if (editHandle) user.handle = '@' + (editHandle.value.trim() || 'user').replace('@', '');
    if (editBio) user.bio = editBio.value.trim();

    // Update initial based on new name
    user.initial = user.name.charAt(0).toUpperCase();

    saveUser(user);
    loadUserProfile();
    updateAvatarDisplay();
    closeEditProfileModal();
}

// Render user's posts
function renderUserPosts() {
    const posts = getPosts();
    renderPosts('userPosts', posts);

    // Update post count
    const postCountEl = document.getElementById('postCount');
    if (postCountEl) {
        postCountEl.textContent = posts.length;
    }
}

/* ====================================
   Page Initialization
   ==================================== */

// Initialize profile page
function initProfilePage() {
    loadUserProfile();
    renderUserPosts();

    // Calculate total likes
    const posts = getPosts();
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const likesCountEl = document.getElementById('likesCount');
    if (likesCountEl) {
        likesCountEl.textContent = totalLikes;
    }
}

/* ====================================
   Document Ready
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
    initProfilePage();
});
