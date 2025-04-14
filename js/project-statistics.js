/**
 * Project Statistics Page JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'inventStoreVendorData';
    let vendorData = null;
    let currentProject = null;
    let projectId = null;

    // --- Element References ---
    const projectNameHeading = document.getElementById('project-name-heading');
    const projectDescriptionEl = document.getElementById('project-description');
    const projectLink = document.getElementById('project-link');
    const notificationArea = document.getElementById('notification-area');
    const appDevelopmentLink = document.getElementById('app-development-link');
    const appConnectionStatus = document.getElementById('app-connection-status');
    const appConnectionMessage = document.getElementById('app-connection-message');
    const appStatisticsGrid = document.getElementById('app-statistics-grid');
    
    // Stat value elements
    const statViews = document.getElementById('stat-views');
    const statClicks = document.getElementById('stat-clicks');
    const statDemos = document.getElementById('stat-demos');
    const statInstalls = document.getElementById('stat-installs');
    const statStack = document.getElementById('stat-stack');
    const statCustomers = document.getElementById('stat-customers');
    const statUsers = document.getElementById('stat-users');
    const statActiveUsers = document.getElementById('stat-active-users');
    const statRetention = document.getElementById('stat-retention');

    // --- Initialize first ---
    initialize();

    /**
     * Initialize the page - load data and set up UI
     */
    function initialize() {
        // First get the project ID from URL
        projectId = getProjectIdFromUrl();
        
        // Then load vendor data
        vendorData = loadVendorData();
        
        if (!projectId) {
            showNotification('No project ID specified.', 'error');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
            return;
        }
        
        if (!vendorData) {
            // Error handling for vendor data is in loadVendorData
            return;
        }
        
        // Find the project by ID
        currentProject = findProjectById();
        
        if (!currentProject) {
            showNotification('Project not found.', 'error');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
            return;
        }
        
        // Set up the project link in breadcrumbs
        if (projectLink) {
            projectLink.href = `project.html?id=${projectId}`;
            projectLink.textContent = currentProject.name || 'Project Details';
        }
        
        // Set up app development link
        if (appDevelopmentLink) {
            appDevelopmentLink.href = `developerPortal.html?id=${projectId}`;
        }
        
        // Render UI and set up event listeners
        renderProjectInfo();
        loadStatistics();
        setupEventListeners();
    }

    /**
     * Gets the project ID from the URL query parameter (?id=...).
     * @returns {string | null} The project ID or null if not found.
     */
    function getProjectIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    /**
     * Loads the full vendor data from local storage. Redirects if data missing.
     * @returns {object | null} The vendor data object or null if redirecting.
     */
    function loadVendorData() {
        try {
            const storedData = localStorage.getItem(storageKey);
            if (!storedData) {
                console.warn("Vendor data not found. Redirecting to register.");
                window.location.href = 'register.html'; // Redirect if no data
                return null;
            }
            let data = JSON.parse(storedData);
            // Ensure projects array exists
            if (!data.projects) {
                data.projects = [];
            }
            return data;
        } catch (error) {
            console.error("Error loading or parsing vendor data:", error);
            alert("Error loading vendor data. Please try logging in or registering again.");
            window.location.href = 'register.html'; // Go back to safety
            return null;
        }
    }

    /**
     * Finds the project object within vendorData based on the projectId.
     * @returns {object | null} The project object or null if not found.
     */
    function findProjectById() {
        if (!vendorData || !Array.isArray(vendorData.projects) || !projectId) {
            console.warn("Cannot find project: Vendor data or projects array missing, or no project ID.");
            return null;
        }
        return vendorData.projects.find(p => p.id === projectId);
    }

    /**
     * Renders the project's basic information (name, description).
     */
    function renderProjectInfo() {
        if (currentProject && projectNameHeading && projectDescriptionEl) {
            projectNameHeading.textContent = `${currentProject.name || 'Project'} Statistics`;
            projectDescriptionEl.textContent = currentProject.description || 'No description provided.';
        } else if (projectNameHeading) {
            // Handle case where project exists but elements don't (should not happen with correct HTML)
            projectNameHeading.textContent = 'Project Statistics Not Found';
            if(projectDescriptionEl) projectDescriptionEl.textContent = 'Could not load project details.';
        }
    }

    /**
     * Loads and displays the statistics for the project.
     * In a real implementation, this would fetch data from a server API.
     * For now, we'll generate some random demo data.
     */
    function loadStatistics() {
        // Check if project has a connected app (simulated for demo)
        const hasConnectedApp = currentProject.hasConnectedApp || false;
        
        // Update the app connection status UI
        updateAppConnectionStatus(hasConnectedApp);
        
        // Load marketing statistics (displayed for all projects)
        loadMarketingStatistics();
        
        // Load app usage statistics (only if app is connected)
        if (hasConnectedApp) {
            loadAppUsageStatistics();
        }
    }

    /**
     * Updates the UI to show app connection status
     * @param {boolean} isConnected - Whether an app is connected to this project
     */
    function updateAppConnectionStatus(isConnected) {
        if (!appConnectionStatus || !appConnectionMessage || !appStatisticsGrid) {
            return;
        }
        
        if (isConnected) {
            appConnectionStatus.textContent = 'Connected';
            appConnectionStatus.style.backgroundColor = '#d1e7dd';
            appConnectionStatus.style.color = '#0f5132';
            appConnectionMessage.classList.add('hidden');
            appStatisticsGrid.classList.remove('hidden');
        } else {
            appConnectionStatus.textContent = 'Not connected';
            appConnectionStatus.style.backgroundColor = '#f8d7da';
            appConnectionStatus.style.color = '#842029';
            appConnectionMessage.classList.remove('hidden');
            appStatisticsGrid.classList.add('hidden');
        }
    }

    /**
     * Loads marketing statistics (simulated for demo)
     */
    function loadMarketingStatistics() {
        // In a real implementation, these would be fetched from a server
        // For demo purposes, we'll use simulated data
        const marketingStats = {
            views: getRandomNumber(100, 5000),
            clicks: getRandomNumber(50, 1000),
            demos: getRandomNumber(10, 200),
            installs: getRandomNumber(5, 100),
            stack: getRandomNumber(2, 50)
        };
        
        // Update UI with statistics
        if (statViews) statViews.textContent = formatNumber(marketingStats.views);
        if (statClicks) statClicks.textContent = formatNumber(marketingStats.clicks);
        if (statDemos) statDemos.textContent = formatNumber(marketingStats.demos);
        if (statInstalls) statInstalls.textContent = formatNumber(marketingStats.installs);
        if (statStack) statStack.textContent = formatNumber(marketingStats.stack);
    }

    /**
     * Loads app usage statistics (simulated for demo)
     */
    function loadAppUsageStatistics() {
        // In a real implementation, these would be fetched from a server
        // For demo purposes, we'll use simulated data
        const appStats = {
            customers: getRandomNumber(5, 100),
            users: getRandomNumber(50, 1000),
            activeUsers: getRandomNumber(20, 500),
            retention: getRandomNumber(30, 95)
        };
        
        // Update UI with statistics
        if (statCustomers) statCustomers.textContent = formatNumber(appStats.customers);
        if (statUsers) statUsers.textContent = formatNumber(appStats.users);
        if (statActiveUsers) statActiveUsers.textContent = formatNumber(appStats.activeUsers);
        if (statRetention) statRetention.textContent = `${appStats.retention}%`;
    }

    /**
     * Displays a notification message.
     * @param {string} message - The message to display.
     * @param {string} [type='success'] - Type ('success', 'error', 'warning', 'info').
     * @param {number} [duration=3000] - Duration in ms.
     */
    let notificationTimeout = null;
    function showNotification(message, type = 'success', duration = 3000) {
        if (!notificationArea) {
             console.warn("Notification area DOM element not found. Message:", message);
             return;
        }
        // Clear any existing timeout to reset timer if messages come quickly
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        notificationArea.textContent = message;
        // Reset classes, then add current ones
        notificationArea.className = 'notification'; // Base class
        notificationArea.classList.add(type); // 'success' or 'error' etc.
        notificationArea.classList.add('show'); // Trigger CSS visibility/transition
        // Set timeout to hide the notification
        notificationTimeout = setTimeout(() => {
            notificationArea.classList.remove('show');
        }, duration);
    }

    /**
     * Helper to generate random numbers for demo data
     */
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Helper to format numbers with commas for thousands
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Set up event listeners for the page
     */
    function setupEventListeners() {
        // Add any specific event listeners for the statistics page here
    }
}); 