/**
 * Vendor Profile JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const adminStorageKey = 'inventStoreAdminData';
    
    // Get vendor ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id') || 'vendor-001'; // Default to Acme Solutions if no ID provided
    
    // DOM Elements
    const vendorNameHeader = document.getElementById('vendor-name-header');
    const vendorCompanyName = document.getElementById('vendor-company-name');
    const vendorIdElement = document.getElementById('vendor-id');
    const vendorEmail = document.getElementById('vendor-email');
    const vendorSize = document.getElementById('vendor-size');
    const vendorStatus = document.getElementById('vendor-status');
    const vendorRegistrationDate = document.getElementById('vendor-registration-date');
    
    // Representative info
    const repName = document.getElementById('rep-name');
    const repRole = document.getElementById('rep-role');
    const repEmail = document.getElementById('rep-email');
    const repPhone = document.getElementById('rep-phone');
    
    // Team members list
    const teamMembersList = document.getElementById('team-members-list');
    
    // Load vendor data
    loadVendorData(vendorId);
    
    /**
     * Loads vendor data and populates the profile page.
     * @param {string} vendorId - The ID of the vendor to load.
     */
    function loadVendorData(vendorId) {
        const adminData = loadAdminData();
        
        if (!adminData || !adminData.vendorDocuments) {
            showError('Failed to load vendor data.');
            setTimeout(() => {
                window.location.href = 'vendors.html';
            }, 2000);
            return;
        }
        
        // If the specific vendor ID is not found, try to use the default mock data
        if (!adminData.vendorDocuments[vendorId]) {
            console.warn(`Vendor ID ${vendorId} not found, using default vendor`);
            const availableVendors = Object.keys(adminData.vendorDocuments);
            if (availableVendors.length > 0) {
                vendorId = availableVendors[0];
            } else {
                showError('Vendor not found. Redirecting to vendors list...');
                setTimeout(() => {
                    window.location.href = 'vendors.html';
                }, 2000);
                return;
            }
        }
        
        const vendorData = adminData.vendorDocuments[vendorId];
        
        // Sample vendor details - in a real app, this would come from the backend
        const vendorDetails = {
            id: vendorId,
            companyName: vendorData.vendorName,
            email: vendorData.vendorEmail,
            size: '1-5',
            status: 'active',
            registrationDate: '2023-05-10',
            representative: {
                name: 'John Smith',
                role: 'Chief Executive Officer',
                email: `john.smith@${vendorData.vendorEmail.split('@')[1]}`,
                phone: '+1 (555) 123-4567'
            },
            teamMembers: [
                {
                    name: 'Sarah Johnson',
                    role: 'Finance Manager',
                    email: `sarah.johnson@${vendorData.vendorEmail.split('@')[1]}`
                },
                {
                    name: 'Michael Brown',
                    role: 'Technical Lead',
                    email: `michael.brown@${vendorData.vendorEmail.split('@')[1]}`
                },
                {
                    name: 'Emily Davis',
                    role: 'Account Manager',
                    email: `emily.davis@${vendorData.vendorEmail.split('@')[1]}`
                }
            ]
        };
        
        // Update the profile UI with vendor data
        updateVendorProfile(vendorDetails);
    }
    
    /**
     * Updates the vendor profile UI with the provided vendor data.
     * @param {object} vendorDetails - The vendor details object.
     */
    function updateVendorProfile(vendorDetails) {
        // Update header and basic info
        vendorNameHeader.textContent = vendorDetails.companyName;
        vendorCompanyName.textContent = vendorDetails.companyName;
        vendorIdElement.textContent = vendorDetails.id;
        vendorEmail.textContent = vendorDetails.email;
        vendorSize.textContent = vendorDetails.size;
        
        // Update status with appropriate badge
        vendorStatus.innerHTML = `<span class="status-badge ${vendorDetails.status}">${capitalizeFirstLetter(vendorDetails.status)}</span>`;
        
        vendorRegistrationDate.textContent = vendorDetails.registrationDate;
        
        // Update representative info
        repName.textContent = vendorDetails.representative.name;
        repRole.textContent = vendorDetails.representative.role;
        repEmail.textContent = vendorDetails.representative.email;
        repPhone.textContent = vendorDetails.representative.phone;
        
        // Clear and update team members list
        teamMembersList.innerHTML = '';
        
        vendorDetails.teamMembers.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.email}</td>
                <td>
                    <button class="action-icon" title="Send Email"><i class="fas fa-envelope"></i></button>
                </td>
            `;
            teamMembersList.appendChild(row);
        });
        
        // Update the document management link
        const documentManagementLinks = document.querySelectorAll('a[href="vendor-document-management.html"]');
        documentManagementLinks.forEach(link => {
            link.href = `vendor-document-management.html?vendor=${vendorDetails.id}`;
        });
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