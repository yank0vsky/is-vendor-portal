document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const projectNameHeading = document.getElementById('project-name-heading');
    const projectDescription = document.getElementById('project-description');
    const collapsibleHeadings = document.querySelectorAll('.collapsible-heading');
    const startBuildingBtn = document.getElementById('start-building-btn');
    const devOptionsModal = document.getElementById('dev-options-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseButton = document.getElementById('modal-close-button');
    const notificationArea = document.getElementById('notification-area');
    const backToProjectLink = document.getElementById('back-to-project-link');
    const breadcrumbProjectLink = document.getElementById('breadcrumb-project-link');

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

    // Load project data
    loadProjectData(projectId);

    // Setup event listeners
    setupEventListeners();

    /**
     * Load project data from localStorage
     * @param {string} projectId - The ID of the project to load
     */
    function loadProjectData(projectId) {
        // For demo purposes, we're using localStorage as our "database"
        // In a real app, this would be an API call
        try {
            const storageKey = 'inventStoreVendorData'; // Match the key used in project.js
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
                document.title = `${project.name} - Developer Portal`;
            } else {
                showNotification('Project not found.', 'error');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            showNotification('Error loading project data.', 'error');
        }
    }

    /**
     * Set up event listeners for interactive elements
     */
    function setupEventListeners() {
        // Collapsible sections
        collapsibleHeadings.forEach(heading => {
            heading.addEventListener('click', () => {
                const isExpanded = heading.getAttribute('aria-expanded') === 'true';
                heading.setAttribute('aria-expanded', !isExpanded);
            });
        });

        // Start Building button
        startBuildingBtn.addEventListener('click', () => {
            showDevOptionsModal();
        });

        // Modal close button
        modalCloseButton.addEventListener('click', () => {
            hideDevOptionsModal();
        });

        // Close modal when clicking outside
        modalBackdrop.addEventListener('click', () => {
            hideDevOptionsModal();
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !devOptionsModal.classList.contains('hidden')) {
                hideDevOptionsModal();
            }
        });
    }

    /**
     * Show the development options modal
     */
    function showDevOptionsModal() {
        devOptionsModal.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');
        // For accessibility
        devOptionsModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    /**
     * Hide the development options modal
     */
    function hideDevOptionsModal() {
        devOptionsModal.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
        // For accessibility
        devOptionsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
    }

    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success or error)
     */
    function showNotification(message, type = 'success') {
        notificationArea.textContent = message;
        notificationArea.className = `notification ${type} show`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notificationArea.className = 'notification';
        }, 5000);
    }
}); 