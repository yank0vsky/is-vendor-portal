/**
 * Vendors List JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const adminStorageKey = 'inventStoreAdminData';
    
    // DOM Elements
    const vendorSearchInput = document.getElementById('vendor-search-input');
    const vendorStatusFilter = document.getElementById('vendor-status-filter');
    const vendorSizeFilter = document.getElementById('vendor-size-filter');
    const vendorsGrid = document.querySelector('.vendors-grid');
    
    // Load vendor data
    loadVendors();
    
    // Event Listeners
    if (vendorSearchInput) {
        vendorSearchInput.addEventListener('input', filterVendors);
    }
    
    if (vendorStatusFilter) {
        vendorStatusFilter.addEventListener('change', filterVendors);
    }
    
    if (vendorSizeFilter) {
        vendorSizeFilter.addEventListener('change', filterVendors);
    }
    
    /**
     * Loads vendor data and renders the vendors grid.
     */
    function loadVendors() {
        const adminData = loadAdminData();
        
        if (!adminData || !adminData.vendorDocuments) {
            showError('Failed to load vendor data.');
            return;
        }
        
        // For a real app, we would fetch more detailed vendor data from the backend
        // For the prototype, we'll use some sample data
        const vendorsData = Object.entries(adminData.vendorDocuments).map(([vendorId, vendorData]) => {
            // Sample status and size - would come from the backend in a real app
            let status, size;
            
            if (vendorId === 'vendor-001') {
                status = 'active';
                size = '1-5';
            } else if (vendorId === 'vendor-002') {
                status = 'pending';
                size = '6-20';
            } else {
                status = 'active';
                size = '21-100';
            }
            
            // Generate a sample vendor ID as GUID
            const vendorGuid = `V-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}-${vendorId.split('-')[1].padStart(3, '0')}`;
            
            return {
                id: vendorId,
                guid: vendorGuid,
                name: vendorData.vendorName,
                email: vendorData.vendorEmail,
                status: status,
                size: size,
                representative: 'John Smith'
            };
        });
        
        renderVendors(vendorsData);
    }
    
    /**
     * Renders vendor cards based on the provided vendors data.
     * @param {Array} vendorsData - Array of vendor data objects.
     */
    function renderVendors(vendorsData) {
        if (!vendorsGrid) return;
        
        vendorsGrid.innerHTML = '';
        
        if (vendorsData.length === 0) {
            vendorsGrid.innerHTML = '<p class="no-results">No vendors found matching your criteria.</p>';
            return;
        }
        
        vendorsData.forEach(vendor => {
            const vendorCard = document.createElement('div');
            vendorCard.className = 'vendor-card';
            vendorCard.setAttribute('data-vendor-id', vendor.id);
            vendorCard.setAttribute('data-vendor-status', vendor.status);
            vendorCard.setAttribute('data-vendor-size', vendor.size);
            
            vendorCard.innerHTML = `
                <div class="vendor-card-header">
                    <h3>${vendor.name}</h3>
                    <span class="vendor-status ${vendor.status}">${capitalizeFirstLetter(vendor.status)}</span>
                </div>
                <div class="vendor-card-content">
                    <p><strong>ID:</strong> <span class="vendor-id">${vendor.guid}</span></p>
                    <p><strong>Email:</strong> ${vendor.email}</p>
                    <p><strong>Size:</strong> ${vendor.size}</p>
                    <p><strong>Representative:</strong> ${vendor.representative}</p>
                </div>
                <div class="vendor-card-footer">
                    <a href="vendor-profile.html?id=${vendor.id}" class="view-vendor-button">View Profile</a>
                    <a href="vendor-document-management.html?vendor=${vendor.id}" class="manage-docs-button">Manage Documents</a>
                </div>
            `;
            
            vendorsGrid.appendChild(vendorCard);
        });
    }
    
    /**
     * Filters vendors based on search input and dropdown filters.
     */
    function filterVendors() {
        const searchTerm = vendorSearchInput ? vendorSearchInput.value.toLowerCase() : '';
        const statusFilter = vendorStatusFilter ? vendorStatusFilter.value : 'all';
        const sizeFilter = vendorSizeFilter ? vendorSizeFilter.value : 'all';
        
        const vendorCards = document.querySelectorAll('.vendor-card');
        
        vendorCards.forEach(card => {
            const vendorName = card.querySelector('h3').textContent.toLowerCase();
            const vendorEmail = card.querySelector('p:nth-child(2)').textContent.toLowerCase();
            const vendorStatus = card.getAttribute('data-vendor-status');
            const vendorSize = card.getAttribute('data-vendor-size');
            
            // Check if vendor matches all filters
            const matchesSearch = vendorName.includes(searchTerm) || vendorEmail.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || vendorStatus === statusFilter;
            const matchesSize = sizeFilter === 'all' || vendorSize === sizeFilter;
            
            // Show or hide the vendor card
            if (matchesSearch && matchesStatus && matchesSize) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show no results message if all cards are hidden
        const visibleCards = document.querySelectorAll('.vendor-card[style="display: none;"]');
        
        if (visibleCards.length === vendorCards.length) {
            let noResults = document.querySelector('.no-results');
            
            if (!noResults) {
                noResults = document.createElement('p');
                noResults.className = 'no-results';
                noResults.textContent = 'No vendors found matching your criteria.';
                vendorsGrid.appendChild(noResults);
            }
        } else {
            const noResults = document.querySelector('.no-results');
            if (noResults) {
                noResults.remove();
            }
        }
    }
    
    /**
     * Loads admin data from local storage.
     * @returns {object | null} The admin data object or null if not found/invalid.
     */
    function loadAdminData() {
        try {
            const storedData = localStorage.getItem(adminStorageKey);
            if (!storedData) {
                console.warn('No admin data found in local storage.');
                return getMockAdminData();
            }
            const parsedData = JSON.parse(storedData);
            // Check if parsed data is valid
            if (!parsedData || !parsedData.vendorDocuments) {
                console.warn('Invalid or incomplete admin data found in local storage.');
                return getMockAdminData();
            }
            return parsedData;
        } catch (error) {
            console.error('Error loading or parsing admin data:', error);
            return getMockAdminData();
        }
    }
    
    /**
     * Returns mock admin data for testing.
     * @returns {object} Mock admin data.
     */
    function getMockAdminData() {
        return {
            user: {
                name: 'Nick Yankovsky',
                email: 'admin@invent.us',
                role: 'Administrator'
            },
            vendorDocuments: {
                'vendor-001': {
                    vendorName: 'Acme Solutions',
                    vendorEmail: 'contact@acme.com',
                    documents: []
                },
                'vendor-002': {
                    vendorName: 'TechCorp',
                    vendorEmail: 'info@techcorp.com',
                    documents: []
                },
                'vendor-003': {
                    vendorName: 'Globex Corporation',
                    vendorEmail: 'support@globex.com',
                    documents: []
                }
            }
        };
    }
    
    /**
     * Capitalizes the first letter of a string.
     * @param {string} string - The string to capitalize.
     * @returns {string} The capitalized string.
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Shows an error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        alert(message);
    }
}); 