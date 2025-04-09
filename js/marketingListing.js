document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const projectNameHeading = document.getElementById('project-name-heading');
    const projectDescription = document.getElementById('project-description');
    const marketingForm = document.getElementById('marketing-listing-form');
    const vendorNameInput = document.getElementById('vendor-name');
    const vendorDescriptionInput = document.getElementById('vendor-description');
    const vendorLogoInput = document.getElementById('vendor-logo');
    const vendorLogoFilename = document.getElementById('vendor-logo-filename');
    const appThumbnailInput = document.getElementById('app-thumbnail');
    const appThumbnailFilename = document.getElementById('app-thumbnail-filename');
    const appPreviewsInput = document.getElementById('app-previews');
    const appPreviewsFilename = document.getElementById('app-previews-filename');
    const notificationArea = document.getElementById('notification-area');
    const backToProjectLink = document.getElementById('back-to-project-link');
    const breadcrumbProjectLink = document.getElementById('breadcrumb-project-link');
    const charCounters = document.querySelectorAll('.char-count');
    const textInputs = document.querySelectorAll('textarea[maxlength]');

    // Constants
    const storageKey = 'inventStoreVendorData';

    // Get project ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        showNotification('No project ID provided.', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 3000);
        return;
    }

    // Set the back to project link href with the project ID
    if (backToProjectLink) {
        backToProjectLink.href = `project.html?id=${projectId}`;
    }

    // Set the project link in breadcrumbs
    if (breadcrumbProjectLink) {
        breadcrumbProjectLink.href = `project.html?id=${projectId}`;
    }

    // Load project and vendor data
    loadData();

    // Setup event listeners
    setupEventListeners();

    /**
     * Load project and vendor data from localStorage
     */
    function loadData() {
        try {
            const vendorData = JSON.parse(localStorage.getItem(storageKey));
            
            if (!vendorData || !Array.isArray(vendorData.projects)) {
                showNotification('Vendor data not found or invalid.', 'error');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
                return;
            }
            
            const project = vendorData.projects.find(p => p.id === projectId);

            if (project) {
                // Update UI with project data
                projectNameHeading.textContent = project.name;
                projectDescription.textContent = project.description;
                document.title = `${project.name} - Marketing Listing`;
                
                // Pre-fill vendor name from vendor data
                if (vendorNameInput && vendorData.companyName) {
                    vendorNameInput.value = vendorData.companyName;
                }
                
                // Load existing marketing listing data if available
                if (project.marketingListing) {
                    populateFormWithExistingData(project.marketingListing);
                }
            } else {
                showNotification('Project not found.', 'error');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('Error loading data.', 'error');
        }
    }

    /**
     * Populate the form with existing marketing listing data
     * @param {Object} data - The marketing listing data
     */
    function populateFormWithExistingData(data) {
        if (data.vendor) {
            if (data.vendor.name) vendorNameInput.value = data.vendor.name;
            if (data.vendor.description) vendorDescriptionInput.value = data.vendor.description;
            // Note: We can't reload file inputs with existing files due to security reasons
        }
        
        if (data.app) {
            const appNameInput = document.getElementById('app-name');
            const appCategorySelect = document.getElementById('app-category');
            const appDescriptionInput = document.getElementById('app-description');
            const appShortDescriptionInput = document.getElementById('app-short-description');
            
            if (data.app.name) appNameInput.value = data.app.name;
            if (data.app.category) appCategorySelect.value = data.app.category;
            if (data.app.description) appDescriptionInput.value = data.app.description;
            if (data.app.shortDescription) appShortDescriptionInput.value = data.app.shortDescription;
        }
        
        // Update character counters for textareas
        updateAllCharCounters();
    }

    /**
     * Set up event listeners for interactive elements
     */
    function setupEventListeners() {
        // Form submission
        if (marketingForm) {
            marketingForm.addEventListener('submit', handleFormSubmission);
        }

        // File input customization for vendor logo
        if (vendorLogoInput) {
            vendorLogoInput.addEventListener('change', () => {
                updateFileInputLabel(vendorLogoInput, vendorLogoFilename);
            });
            
            // Make the custom button trigger the file input
            const vendorLogoButton = vendorLogoInput.nextElementSibling;
            if (vendorLogoButton) {
                vendorLogoButton.addEventListener('click', () => {
                    vendorLogoInput.click();
                });
            }
        }

        // File input customization for app thumbnail
        if (appThumbnailInput) {
            appThumbnailInput.addEventListener('change', () => {
                updateFileInputLabel(appThumbnailInput, appThumbnailFilename);
            });
            
            // Make the custom button trigger the file input
            const appThumbnailButton = appThumbnailInput.nextElementSibling;
            if (appThumbnailButton) {
                appThumbnailButton.addEventListener('click', () => {
                    appThumbnailInput.click();
                });
            }
        }

        // File input customization for app previews
        if (appPreviewsInput) {
            appPreviewsInput.addEventListener('change', () => {
                updateFileInputLabel(appPreviewsInput, appPreviewsFilename, true);
            });
            
            // Make the custom button trigger the file input
            const appPreviewsButton = appPreviewsInput.nextElementSibling;
            if (appPreviewsButton) {
                appPreviewsButton.addEventListener('click', () => {
                    appPreviewsInput.click();
                });
            }
        }

        // Character counters for textareas
        textInputs.forEach(textarea => {
            textarea.addEventListener('input', () => {
                updateCharCounter(textarea);
            });
        });
    }

    /**
     * Handle form submission
     * @param {Event} event - The form submission event
     */
    function handleFormSubmission(event) {
        event.preventDefault();
        
        // Basic validation
        if (!marketingForm.checkValidity()) {
            // The browser will handle displaying validation messages
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Collect form data
        const formData = {
            vendor: {
                name: vendorNameInput.value,
                description: vendorDescriptionInput.value,
                // In a real app, file uploads would be handled differently
                logoUploaded: vendorLogoInput.files.length > 0
            },
            app: {
                name: document.getElementById('app-name').value,
                category: document.getElementById('app-category').value,
                description: document.getElementById('app-description').value,
                shortDescription: document.getElementById('app-short-description').value,
                thumbnailUploaded: appThumbnailInput.files.length > 0,
                previewsUploaded: appPreviewsInput.files.length > 0,
                previewCount: appPreviewsInput.files.length
            },
            dateSubmitted: new Date().toISOString()
        };
        
        // Validate file uploads
        if (!formData.app.thumbnailUploaded) {
            showNotification('Please upload an app thumbnail.', 'error');
            return;
        }
        
        if (!formData.app.previewsUploaded) {
            showNotification('Please upload at least one app preview.', 'error');
            return;
        }
        
        // In a real app, we would upload files to a server
        // For this mock, we'll just save the form data to localStorage
        saveMarketingListing(formData);
    }

    /**
     * Save the marketing listing data to localStorage
     * @param {Object} formData - The marketing listing form data
     */
    function saveMarketingListing(formData) {
        try {
            const vendorData = JSON.parse(localStorage.getItem(storageKey));
            
            if (!vendorData || !Array.isArray(vendorData.projects)) {
                showNotification('Error: Could not access vendor data.', 'error');
                return;
            }
            
            const projectIndex = vendorData.projects.findIndex(p => p.id === projectId);
            
            if (projectIndex === -1) {
                showNotification('Error: Project not found.', 'error');
                return;
            }
            
            // Add marketing listing to the project
            vendorData.projects[projectIndex].marketingListing = formData;
            
            // Save updated vendor data
            localStorage.setItem(storageKey, JSON.stringify(vendorData));
            
            showNotification('Marketing listing submitted successfully!', 'success');
            
            // In a real app, we might redirect to a confirmation page
            setTimeout(() => {
                window.location.href = `project.html?id=${projectId}`;
            }, 2000);
        } catch (error) {
            console.error('Error saving marketing listing:', error);
            showNotification('Error saving marketing listing.', 'error');
        }
    }

    /**
     * Update file input label with the selected filename
     * @param {HTMLElement} fileInput - The file input element
     * @param {HTMLElement} filenameElement - The element to display the filename
     * @param {boolean} multiple - Whether multiple files can be selected
     */
    function updateFileInputLabel(fileInput, filenameElement, multiple = false) {
        if (!fileInput || !filenameElement) return;
        
        if (fileInput.files.length === 0) {
            filenameElement.textContent = multiple ? 'No files chosen' : 'No file chosen';
        } else if (fileInput.files.length === 1) {
            filenameElement.textContent = fileInput.files[0].name;
        } else {
            filenameElement.textContent = `${fileInput.files.length} files selected`;
        }
    }

    /**
     * Update character counter for a textarea
     * @param {HTMLElement} textarea - The textarea element
     */
    function updateCharCounter(textarea) {
        if (!textarea) return;
        
        const maxLength = textarea.getAttribute('maxlength');
        if (!maxLength) return;
        
        const currentLength = textarea.value.length;
        const counterSpan = textarea.parentElement.querySelector('.char-count');
        
        if (counterSpan) {
            counterSpan.textContent = `(${currentLength}/${maxLength})`;
        }
    }

    /**
     * Update all character counters
     */
    function updateAllCharCounters() {
        textInputs.forEach(textarea => {
            updateCharCounter(textarea);
        });
    }

    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success or error)
     */
    function showNotification(message, type = 'success') {
        if (!notificationArea) return;
        
        notificationArea.textContent = message;
        notificationArea.className = `notification ${type} show`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notificationArea.className = 'notification';
        }, 5000);
    }
}); 