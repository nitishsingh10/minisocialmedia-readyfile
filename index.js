/* ====================================
   Index (Home) Page JavaScript
   ==================================== */

// Current post mode
let currentPostMode = 'text';

/* ====================================
   Event Handlers
   ==================================== */

// Handle post creation
function handleCreatePost(event) {
    event.preventDefault();

    if (currentPostMode === 'text') {
        // Blog mode
        const textarea = document.getElementById('postContent');
        const content = textarea.value.trim();

        if (!content) return;

        createPost('text', content, null);
        textarea.value = '';
    } else {
        // Image mode
        const imagePreview = document.getElementById('imagePreview');
        const captionInput = document.getElementById('imageCaption');
        const hasImage = document.getElementById('imagePreviewContainer').classList.contains('active');

        if (!hasImage) {
            alert('Please select an image to post');
            return;
        }

        const imageData = imagePreview.src;
        const caption = captionInput ? captionInput.value.trim() : '';

        createPost('image', caption, imageData);

        // Reset image mode
        handleRemoveImage();
        if (captionInput) captionInput.value = '';
    }

    // Reset to blog mode
    handlePostTypeClick('text');

    // Refresh feed
    renderPosts('feed');
}

// Handle post type button click
function handlePostTypeClick(type) {
    currentPostMode = type;

    // Update button states
    document.querySelectorAll('.post-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.post-type-btn[data-type="${type}"]`)?.classList.add('active');

    // Switch modes
    const blogMode = document.getElementById('blogMode');
    const imageMode = document.getElementById('imageMode');

    if (blogMode && imageMode) {
        if (type === 'text') {
            blogMode.classList.add('active');
            imageMode.classList.remove('active');
        } else {
            blogMode.classList.remove('active');
            imageMode.classList.add('active');
        }
    }
}

// Handle image selection
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imagePreview = document.getElementById('imagePreview');
        const previewContainer = document.getElementById('imagePreviewContainer');
        const dropZone = document.getElementById('imageDropZone');

        if (imagePreview) imagePreview.src = e.target.result;
        if (previewContainer) previewContainer.classList.add('active');
        if (dropZone) dropZone.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Handle removing image preview
function handleRemoveImage() {
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const imageInput = document.getElementById('imageInput');
    const dropZone = document.getElementById('imageDropZone');

    if (imagePreview) imagePreview.src = '';
    if (previewContainer) previewContainer.classList.remove('active');
    if (imageInput) imageInput.value = '';
    if (dropZone) dropZone.style.display = 'block';
}

/* ====================================
   Page Initialization
   ==================================== */

// Initialize feed page
function initFeedPage() {
    // Update avatar display
    updateAvatarDisplay();

    // Render posts
    renderPosts('feed');

    // Set up form submission
    const postForm = document.getElementById('createPostForm');
    if (postForm) {
        postForm.addEventListener('submit', handleCreatePost);
    }

    // Set up image input
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageSelect);
    }

    // Set up drag and drop for image zone
    const dropZone = document.getElementById('imageDropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--accent-primary)';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const imageInput = document.getElementById('imageInput');
                imageInput.files = files;
                handleImageSelect({ target: { files: files } });
            }
        });
    }
}

/* ====================================
   Document Ready
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
    initFeedPage();
});
