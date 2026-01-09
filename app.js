/* ====================================
   SocialApp - Mini Social Media Platform
   Core/Shared JavaScript Functionality
   ==================================== */

// Local Storage Keys
const STORAGE_KEYS = {
  POSTS: 'socialapp_posts',
  THEME: 'socialapp_theme',
  USER: 'socialapp_user',
  SETTINGS: 'socialapp_settings'
};

// Default User
const DEFAULT_USER = {
  name: 'User',
  handle: '@user',
  initial: 'U',
  avatar: null,
  bio: ''
};

/* ====================================
   Utility Functions
   ==================================== */

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format timestamp to relative time
function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ====================================
   Local Storage Functions
   ==================================== */

// Get posts from storage
function getPosts() {
  try {
    const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
    return posts ? JSON.parse(posts) : [];
  } catch (e) {
    console.error('Error reading posts:', e);
    return [];
  }
}

// Save posts to storage
function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving posts:', e);
  }
}

// Get theme from storage
function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

// Save theme to storage
function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

// Get user from storage
function getUser() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : { ...DEFAULT_USER };
  } catch (e) {
    console.error('Error reading user:', e);
    return { ...DEFAULT_USER };
  }
}

// Save user to storage
function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user:', e);
  }
}

// Clear all data
function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.POSTS);
  localStorage.removeItem(STORAGE_KEYS.THEME);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

/* ====================================
   Theme Management
   ==================================== */

// Apply theme to document
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Update toggle if on settings page
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.checked = theme === 'dark';
  }
}

// Initialize theme on page load
function initTheme() {
  const savedTheme = getTheme();
  applyTheme(savedTheme);
}

// Toggle theme
function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  saveTheme(newTheme);
  applyTheme(newTheme);
}

/* ====================================
   Avatar Display
   ==================================== */

// Update avatar in navigation/feed
function updateAvatarDisplay() {
  const user = getUser();
  const avatars = document.querySelectorAll('.avatar, #userAvatar');

  avatars.forEach(avatar => {
    if (user.avatar) {
      avatar.innerHTML = `<img src="${user.avatar}" alt="Avatar">`;
    } else {
      avatar.innerHTML = (user.name || 'U').charAt(0).toUpperCase();
    }
  });
}

/* ====================================
   Post Management
   ==================================== */

// Create a new post
function createPost(type, content, imageData = null) {
  const user = getUser();
  const post = {
    id: generateId(),
    type: type, // 'text' or 'image'
    content: content,
    imageData: imageData,
    timestamp: Date.now(),
    likes: 0,
    liked: false,
    author: {
      name: user.name,
      handle: user.handle,
      initial: user.initial,
      avatar: user.avatar
    }
  };

  const posts = getPosts();
  posts.unshift(post); // Add to beginning
  savePosts(posts);

  return post;
}

// Delete a post
function deletePost(postId) {
  const posts = getPosts();
  const filteredPosts = posts.filter(post => post.id !== postId);
  savePosts(filteredPosts);
}

// Toggle like on a post
function toggleLike(postId) {
  const posts = getPosts();
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
    if (posts[postIndex].liked) {
      posts[postIndex].likes--;
      posts[postIndex].liked = false;
    } else {
      posts[postIndex].likes++;
      posts[postIndex].liked = true;
    }
    savePosts(posts);
    return posts[postIndex];
  }
  return null;
}

/* ====================================
   UI Rendering Functions
   ==================================== */

// Create post HTML element
function createPostElement(post) {
  const article = document.createElement('article');
  article.className = 'card post-card';
  article.dataset.postId = post.id;

  const timeAgo = formatTimeAgo(post.timestamp);
  const likeIcon = post.liked ?
    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` :
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

  // Get author info (fallback to current user for backward compatibility)
  const author = post.author || getUser();
  const authorName = author.name || 'User';
  const authorInitial = author.initial || authorName.charAt(0).toUpperCase();
  const authorAvatar = author.avatar;

  const avatarContent = authorAvatar
    ? `<img src="${authorAvatar}" alt="Avatar">`
    : authorInitial;

  article.innerHTML = `
    <div class="post-header">
      <div class="post-author">
        <div class="avatar">${avatarContent}</div>
        <div class="post-author-info">
          <h4>${escapeHtml(authorName)}</h4>
          <span>${timeAgo}</span>
        </div>
      </div>
      <button class="post-delete-btn" onclick="handleDeletePost('${post.id}')" title="Delete post">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    </div>
    ${post.content ? `<p class="post-content">${escapeHtml(post.content)}</p>` : ''}
    ${post.imageData ? `<img src="${post.imageData}" alt="Post image" class="post-image">` : ''}
    <div class="post-actions">
      <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="handleLikePost('${post.id}')">
        ${likeIcon}
        <span>${post.likes}</span>
      </button>
    </div>
  `;

  return article;
}

// Render posts to feed
function renderPosts(containerId, postsToRender = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = postsToRender !== null ? postsToRender : getPosts();

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <h3>No posts yet</h3>
        <p>Be the first to share something!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  posts.forEach(post => {
    container.appendChild(createPostElement(post));
  });
}

/* ====================================
   Event Handlers
   ==================================== */

// Handle post deletion
function handleDeletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    deletePost(postId);

    // Remove from DOM
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
      postElement.style.opacity = '0';
      postElement.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        postElement.remove();

        // Check if feed is now empty
        const feed = document.getElementById('feed');
        const userPosts = document.getElementById('userPosts');
        const popularPosts = document.getElementById('popularPosts');

        if (feed && feed.children.length === 0) {
          renderPosts('feed');
        }
        if (userPosts && userPosts.children.length === 0) {
          renderPosts('userPosts', []);
        }
        if (popularPosts && popularPosts.children.length === 0) {
          renderPosts('popularPosts', []);
        }
      }, 300);
    }

    // Update profile post count if on profile page
    const postCountEl = document.getElementById('postCount');
    if (postCountEl) {
      postCountEl.textContent = getPosts().length;
    }
  }
}

// Handle like toggle
function handleLikePost(postId) {
  const updatedPost = toggleLike(postId);
  if (!updatedPost) return;

  // Update the post element
  const postElement = document.querySelector(`[data-post-id="${postId}"]`);
  if (postElement) {
    const likeBtn = postElement.querySelector('.post-action-btn');
    const likeCount = likeBtn.querySelector('span');

    likeBtn.classList.toggle('liked', updatedPost.liked);
    likeCount.textContent = updatedPost.likes;

    // Update icon
    const likeIcon = updatedPost.liked ?
      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` :
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

    likeBtn.innerHTML = likeIcon + `<span>${updatedPost.likes}</span>`;
  }
}

/* ====================================
   Document Ready - Initialize Theme
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize theme first (shared across all pages)
  initTheme();
});
