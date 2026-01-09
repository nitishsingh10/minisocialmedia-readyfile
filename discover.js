/* ====================================
   Discover Page JavaScript
   ==================================== */

/* ====================================
   Discover Page Functions
   ==================================== */

// Search for a topic
function searchTopic(topic) {
    document.getElementById('searchInput').value = '#' + topic;
    // In a real app, this would trigger a search
    alert('Searching for: #' + topic);
}

// Filter by category
function filterByCategory(category) {
    // In a real app, this would filter posts by category
    alert('Filtering by: ' + category);
}

// Render popular posts (sorted by likes)
function renderPopularPosts() {
    const posts = JSON.parse(localStorage.getItem('socialapp_posts') || '[]');
    const sortedPosts = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);

    const container = document.getElementById('popularPosts');

    if (sortedPosts.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h3>No popular posts yet</h3>
        <p>Start creating content to see it here!</p>
      </div>
    `;
        return;
    }

    container.innerHTML = '';
    sortedPosts.forEach(post => {
        container.appendChild(createPostElement(post));
    });
}

/* ====================================
   Page Initialization
   ==================================== */

// Initialize discover page
function initDiscoverPage() {
    renderPopularPosts();
}

/* ====================================
   Document Ready
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
    initDiscoverPage();
});
