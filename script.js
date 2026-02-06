// script.js - Complete JavaScript for Victoria Mwende's Personal Website

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Form validation for contact page
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            const newsletter = document.getElementById('newsletter').checked;
            
            // Validation
            let isValid = true;
            
            // Clear previous error messages
            clearErrors();
            
            // Name validation
            if (name === '') {
                showError('name', 'Please enter your name');
                isValid = false;
            }
            
            // Email validation
            if (email === '') {
                showError('email', 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Subject validation
            if (subject === '') {
                showError('subject', 'Please select a subject');
                isValid = false;
            }
            
            // Message validation
            if (message === '') {
                showError('message', 'Please enter your message');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                // Create form data object
                const formData = {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    newsletter: newsletter,
                    timestamp: new Date().toISOString()
                };
                
                // Save to localStorage (for demo purposes)
                saveContactMessage(formData);
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
            }
        });
    }
    
    // Skills page slider functionality
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const projectsSlider = document.querySelector('.projects-slider');
    
    if (prevBtn && nextBtn && projectsSlider) {
        let scrollPosition = 0;
        const slideWidth = 340; // Width of each slide + gap
        
        nextBtn.addEventListener('click', function() {
            scrollPosition += slideWidth;
            if (scrollPosition > projectsSlider.scrollWidth - projectsSlider.clientWidth) {
                scrollPosition = 0;
            }
            projectsSlider.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
        
        prevBtn.addEventListener('click', function() {
            scrollPosition -= slideWidth;
            if (scrollPosition < 0) {
                scrollPosition = projectsSlider.scrollWidth - projectsSlider.clientWidth;
            }
            projectsSlider.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    }
    
    // Animate skill bars on scroll (for skills page)
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length > 0) {
        // Create an Intersection Observer to animate skill bars when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillItem = entry.target;
                    const levelFill = skillItem.querySelector('.level-fill');
                    
                    // Get the width from the style attribute
                    const width = levelFill.style.width;
                    
                    // Reset width to 0 for animation
                    levelFill.style.width = '0%';
                    
                    // Animate to the actual width
                    setTimeout(() => {
                        levelFill.style.transition = 'width 1.5s ease-in-out';
                        levelFill.style.width = width;
                    }, 300);
                    
                    // Stop observing after animation
                    observer.unobserve(skillItem);
                }
            });
        }, { threshold: 0.5 });
        
        skillItems.forEach(item => observer.observe(item));
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only smooth scroll for same-page anchors
            if (href !== '#' && href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize profile photo upload
    initializeProfilePhotoUpload();
    
    // Initialize gallery functionality if on gallery page
    if (window.location.pathname.includes('gallery.html')) {
        initializeGallery();
    }
    
    // Add current year to footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Add interactive effects to cards on hover
    const cards = document.querySelectorAll('.link-card, .activity-card, .hobby-card, .goal-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Initialize Profile Photo Upload
function initializeProfilePhotoUpload() {
    // Homepage profile photo upload
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profile-image');
    const defaultProfileIcon = document.getElementById('default-profile-icon');
    
    if (profileUpload && profileImage) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadProfilePhoto(file, 'homepage');
            }
        });
        
        // Load saved profile photo
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            defaultProfileIcon.style.display = 'none';
            profileImage.src = savedPhoto;
            profileImage.style.display = 'block';
        }
    }
    
    // Contact page profile photo upload
    const contactProfileUpload = document.getElementById('contact-profile-upload');
    const contactProfileImage = document.getElementById('contactProfileImage');
    const contactDefaultIcon = document.getElementById('contactDefaultIcon');
    
    if (contactProfileUpload && contactProfileImage) {
        contactProfileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadProfilePhoto(file, 'contact');
            }
        });
        
        // Load saved contact profile photo
        const savedContactPhoto = localStorage.getItem('contactProfilePhoto');
        if (savedContactPhoto) {
            contactDefaultIcon.style.display = 'none';
            contactProfileImage.src = savedContactPhoto;
            contactProfileImage.style.display = 'block';
        }
    }
}

// Upload Profile Photo
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
            const defaultProfileIcon = document.getElementById('default-profile-icon');
            const profileImage = document.getElementById('profile-image');
            
            if (defaultProfileIcon && profileImage) {
                defaultProfileIcon.style.display = 'none';
                profileImage.src = e.target.result;
                profileImage.style.display = 'block';
            }
            
            // Save to localStorage
            localStorage.setItem('profilePhoto', e.target.result);
        } else if (location === 'contact') {
            // Update contact page profile
            const contactDefaultIcon = document.getElementById('contactDefaultIcon');
            const contactProfileImage = document.getElementById('contactProfileImage');
            
            if (contactDefaultIcon && contactProfileImage) {
                contactDefaultIcon.style.display = 'none';
                contactProfileImage.src = e.target.result;
                contactProfileImage.style.display = 'block';
            }
            
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

// Initialize Gallery Functionality
function initializeGallery() {
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

    // Load saved photos from localStorage
    loadSavedPhotos();

    // Upload Area Click Handler
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            galleryUpload.click();
        });
    }

    // Gallery Upload Change Handler
    if (galleryUpload) {
        galleryUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                uploadPhotos(files);
            }
        });
    }

    // Category Filtering
    if (categoryBtns.length > 0) {
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
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            photoModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === photoModal) {
            photoModal.style.display = 'none';
        }
    });

    // Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const imageUrl = modalImage.src;
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'victoria-mwende-photo.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Delete Button
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const photoId = modalImage.getAttribute('data-id');
            if (photoId && confirm('Are you sure you want to delete this photo?')) {
                deletePhoto(photoId);
                photoModal.style.display = 'none';
            }
        });
    }

    // Drag and Drop Functionality
    if (uploadArea) {
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
    }

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
        if (uploadProgress) {
            uploadProgress.style.display = 'block';
        }
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        if (progressText) {
            progressText.textContent = 'Processing photos...';
        }

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
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }
                if (progressText) {
                    progressText.textContent = `Uploading ${uploadedCount} of ${totalFiles} photos...`;
                }

                // Add to gallery
                addPhotoToGallery(photo);

                // Hide progress when done
                if (uploadedCount === totalFiles) {
                    setTimeout(() => {
                        if (uploadProgress) {
                            uploadProgress.style.display = 'none';
                        }
                        if (progressText) {
                            progressText.textContent = 'Upload complete!';
                        }
                        
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

    function savePhoto(photo) {
        let photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        photos.push(photo);
        localStorage.setItem('galleryPhotos', JSON.stringify(photos));
    }

    function loadSavedPhotos() {
        // Load gallery photos
        const savedPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        if (savedPhotos.length > 0 && uploadPrompt) {
            uploadPrompt.style.display = 'none';
        }
        
        savedPhotos.forEach(photo => {
            addPhotoToGallery(photo);
        });
    }

   

