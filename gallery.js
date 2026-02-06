// gallery.js - Photo Gallery and Upload Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadArea = document.getElementById('uploadArea');
    const galleryUpload = document.getElementById('gallery-upload');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const galleryGrid = document.querySelector('.gallery-grid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const photoModal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.querySelector('.close-modal');
    const downloadBtn = document.getElementById('downloadBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const uploadPrompt = document.getElementById('uploadPrompt');

    // Profile photo upload on homepage
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profile-image');
    const defaultProfileIcon = document.getElementById('default-profile-icon');
    const profileImageContainer = document.getElementById('profile-image-container');

    // Profile photo upload in contact page
    const contactProfileUpload = document.getElementById('contact-profile-upload');
    const contactProfileImage = document.getElementById('contactProfileImage');
    const contactDefaultIcon = document.getElementById('contactDefaultIcon');
    const contactProfileContainer = document.getElementById('contactProfileContainer');

    // Load saved photos from localStorage
    loadSavedPhotos();

    // Upload Area Click Handler
    uploadArea.addEventListener('click', function() {
        galleryUpload.click();
    });

    // Gallery Upload Change Handler
    galleryUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            uploadPhotos(files);
        }
    });

    // Profile Photo Upload (Homepage)
    if (profileUpload) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadProfilePhoto(file, 'homepage');
            }
        });
    }

    // Profile Photo Upload (Contact Page)
    if (contactProfileUpload) {
        contactProfileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadProfilePhoto(file, 'contact');
            }
        });
    }

    // Category Filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGallery(category);
        });
    });

    // Close Modal
    closeModal.addEventListener('click', function() {
        photoModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === photoModal) {
            photoModal.style.display = 'none';
        }
    });

    // Download Button
    downloadBtn.addEventListener('click', function() {
        const imageUrl = modalImage.src;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'victoria-mwende-photo.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Delete Button
    deleteBtn.addEventListener('click', function() {
        const photoId = modalImage.getAttribute('data-id');
        if (photoId && confirm('Are you sure you want to delete this photo?')) {
            deletePhoto(photoId);
            photoModal.style.display = 'none';
        }
    });

    // Drag and Drop Functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.background = 'linear-gradient(135deg, rgba(157, 78, 221, 0.1), rgba(255, 133, 192, 0.1))';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.background = 'linear-gradient(135deg, rgba(157, 78, 221, 0.05), rgba(255, 133, 192, 0.05))';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = 'linear-gradient(135deg, rgba(157, 78, 221, 0.05), rgba(255, 133, 192, 0.05))';
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                uploadPhotos(imageFiles);
            } else {
                alert('Please drop only image files (JPG, PNG, GIF)');
            }
        }
    });

    // Functions
    function uploadPhotos(files) {
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            return validTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length === 0) {
            alert('Please select valid image files (JPG, PNG, GIF, WebP) under 5MB each');
            return;
        }

        // Show upload progress
        uploadProgress.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Processing photos...';

        let uploadedCount = 0;
        const totalFiles = validFiles.length;

        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create photo object
                const photo = {
                    id: Date.now() + index,
                    url: e.target.result,
                    title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                    description: `Uploaded on ${new Date().toLocaleDateString()}`,
                    category: 'personal',
                    date: new Date().toISOString()
                };

                // Save to localStorage
                savePhoto(photo);

                // Update progress
                uploadedCount++;
                const progress = (uploadedCount / totalFiles) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Uploading ${uploadedCount} of ${totalFiles} photos...`;

                // Add to gallery
                addPhotoToGallery(photo);

                // Hide progress when done
                if (uploadedCount === totalFiles) {
                    setTimeout(() => {
                        uploadProgress.style.display = 'none';
                        progressText.textContent = 'Upload complete!';
                        
                        // Hide upload prompt
                        if (uploadPrompt) {
                            uploadPrompt.style.display = 'none';
                        }
                    }, 1000);
                }
            };

            reader.onerror = function() {
                alert(`Error reading file: ${file.name}`);
                uploadedCount++;
            };

            reader.readAsDataURL(file);
        });
    }

    function uploadProfilePhoto(file, location) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
            return;
        }

        if (file.size > maxSize) {
            alert('Please select an image under 2MB');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (location === 'homepage') {
                // Update homepage profile
                defaultProfileIcon.style.display = 'none';
                profileImage.src = e.target.result;
                profileImage.style.display = 'block';
                
                // Save to localStorage
                localStorage.setItem('profilePhoto', e.target.result);
            } else if (location === 'contact') {
                // Update contact page profile
                contactDefaultIcon.style.display = 'none';
                contactProfileImage.src = e.target.result;
                contactProfileImage.style.display = 'block';
                
                // Save to localStorage
                localStorage.setItem('contactProfilePhoto', e.target.result);
            }
            
            showNotification('Profile photo updated successfully!', 'success');
        };

        reader.onerror = function() {
            alert('Error reading the image file. Please try again.');
        };

        reader.readAsDataURL(file);
    }

    function savePhoto(photo) {
        let photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        photos.push(photo);
        localStorage.setItem('galleryPhotos', JSON.stringify(photos));
    }

    function loadSavedPhotos() {
        // Load profile photos
        const savedProfilePhoto = localStorage.getItem('profilePhoto');
        if (savedProfilePhoto && profileImage) {
            defaultProfileIcon.style.display = 'none';
            profileImage.src = savedProfilePhoto;
            profileImage.style.display = 'block';
        }

        const savedContactPhoto = localStorage.getItem('contactProfilePhoto');
        if (savedContactPhoto && contactProfileImage) {
            contactDefaultIcon.style.display = 'none';
            contactProfileImage.src = savedContactPhoto;
            contactProfileImage.style.display = 'block';
        }

        // Load gallery photos
        const savedPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        if (savedPhotos.length > 0 && uploadPrompt) {
            uploadPrompt.style.display = 'none';
        }
        
        savedPhotos.forEach(photo => {
            addPhotoToGallery(photo);
        });
    }

    function addPhotoToGallery(photo) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', photo.category);
        galleryItem.setAttribute('data-id', photo.id);

        galleryItem.innerHTML = `
            <div class="gallery-image">
                <img src="${photo.url}" alt="${photo.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${photo.title}</h4>
                    <p>${photo.description}</p>
                </div>
            </div>
        `;

        // Insert before the upload prompt
        if (uploadPrompt) {
            galleryGrid.insertBefore(galleryItem, uploadPrompt);
        } else {
            galleryGrid.appendChild(galleryItem);
        }

        // Add click event to open modal
        galleryItem.addEventListener('click', function() {
            openPhotoModal(photo);
        });
    }

    function openPhotoModal(photo) {
        modalImage.src = photo.url;
        modalImage.setAttribute('data-id', photo.id);
        modalTitle.textContent = photo.title;
        modalDescription.textContent = photo.description;
        photoModal.style.display = 'block';
    }

    function deletePhoto(photoId) {
        let photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        photos = photos.filter(photo => photo.id.toString() !== photoId.toString());
        localStorage.setItem('galleryPhotos', JSON.stringify(photos));

        // Remove from DOM
        const photoElement = document.querySelector(`.gallery-item[data-id="${photoId}"]`);
        if (photoElement) {
            photoElement.remove();
        }

        // Show upload prompt if no photos left
        const remainingPhotos = document.querySelectorAll('.gallery-item:not(.empty)');
        if (remainingPhotos.length === 0 && uploadPrompt) {
            uploadPrompt.style.display = 'flex';
        }

        showNotification('Photo deleted successfully!', 'success');
    }

    function filterGallery(category) {
        const galleryItems = document.querySelectorAll('.gallery-item:not(.empty)');
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide upload prompt based on category
        if (uploadPrompt) {
            if (category === 'all' || category === 'personal') {
                uploadPrompt.style.display = 'flex';
            } else {
                uploadPrompt.style.display = 'none';
            }
        }
    }

    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--gradient)' : '#e74c3c'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});