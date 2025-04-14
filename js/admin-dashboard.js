/**
 * Admin Dashboard JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const adminStorageKey = 'inventStoreAdminData';
    const vendorStorageKey = 'inventStoreVendorData';
    
    // Initialize admin data if it doesn't exist
    initializeAdminData();
    
    /**
     * Initializes admin data in local storage if it doesn't exist.
     */
    function initializeAdminData() {
        if (!localStorage.getItem(adminStorageKey)) {
            const initialAdminData = {
                user: {
                    name: 'Admin User',
                    email: 'admin@invent.us',
                    role: 'Administrator'
                },
                stats: {
                    totalVendors: 24,
                    pendingDocuments: 7,
                    approvedVendors: 18,
                    activeProjects: 42
                },
                defaultDocuments: [
                    {
                        id: 'doc-001',
                        name: 'Terms and Conditions',
                        type: 'terms',
                        dateAdded: '2023-05-15T10:30:00Z',
                        addedBy: 'admin@invent.us',
                        content: `
                            <h4>Terms and Conditions</h4>
                            <p>This is a placeholder for the Terms and Conditions document.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        `
                    },
                    {
                        id: 'doc-002',
                        name: 'Vendor Agreement',
                        type: 'agreement',
                        dateAdded: '2023-05-16T14:20:00Z',
                        addedBy: 'admin@invent.us',
                        content: `
                            <h4>Vendor Agreement</h4>
                            <p>This is a placeholder for the Vendor Agreement document.</p>
                            <p>Phasellus ultrices nulla quis nibh. Quisque a lectus.</p>
                        `
                    },
                    {
                        id: 'doc-003',
                        name: 'Non-Disclosure Agreement',
                        type: 'mnda',
                        dateAdded: '2023-05-17T09:45:00Z',
                        addedBy: 'admin@invent.us',
                        content: `
                            <h4>Non-Disclosure Agreement</h4>
                            <p>This is a placeholder for the Non-Disclosure Agreement document.</p>
                            <p>Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna.</p>
                        `
                    }
                ],
                activities: [
                    {
                        id: 'act-001',
                        type: 'newVendor',
                        title: 'New Vendor',
                        description: 'Acme Solutions registered',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
                    },
                    {
                        id: 'act-002',
                        type: 'documentSigned',
                        title: 'Document Signed',
                        description: 'TechCorp accepted Terms & Conditions',
                        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
                    },
                    {
                        id: 'act-003',
                        type: 'documentUpdated',
                        title: 'Document Updated',
                        description: 'Default MNDA updated by Admin',
                        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
                    }
                ],
                vendorDocuments: {
                    'vendor-001': {
                        vendorName: 'Acme Solutions',
                        vendorEmail: 'contact@acme.com',
                        documents: [
                            {
                                id: 'vdoc-001',
                                name: 'Terms and Conditions',
                                type: 'terms',
                                dateAdded: '2023-06-01T10:30:00Z',
                                status: 'accepted',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-06-01T10:30:00Z',
                                        by: 'admin@invent.us'
                                    },
                                    {
                                        action: 'accepted',
                                        date: '2023-06-02T14:20:00Z',
                                        by: 'contact@acme.com'
                                    }
                                ]
                            },
                            {
                                id: 'vdoc-002',
                                name: 'Vendor Agreement',
                                type: 'agreement',
                                dateAdded: '2023-06-01T10:30:00Z',
                                status: 'pending',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-06-01T10:30:00Z',
                                        by: 'admin@invent.us'
                                    }
                                ]
                            }
                        ]
                    },
                    'vendor-002': {
                        vendorName: 'TechCorp',
                        vendorEmail: 'info@techcorp.com',
                        documents: [
                            {
                                id: 'vdoc-003',
                                name: 'Terms and Conditions',
                                type: 'terms',
                                dateAdded: '2023-05-20T09:15:00Z',
                                status: 'accepted',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-05-20T09:15:00Z',
                                        by: 'admin@invent.us'
                                    },
                                    {
                                        action: 'accepted',
                                        date: '2023-05-21T11:30:00Z',
                                        by: 'info@techcorp.com'
                                    }
                                ]
                            },
                            {
                                id: 'vdoc-004',
                                name: 'Vendor Agreement',
                                type: 'agreement',
                                dateAdded: '2023-05-20T09:15:00Z',
                                status: 'accepted',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-05-20T09:15:00Z',
                                        by: 'admin@invent.us'
                                    },
                                    {
                                        action: 'accepted',
                                        date: '2023-05-22T14:45:00Z',
                                        by: 'info@techcorp.com'
                                    }
                                ]
                            },
                            {
                                id: 'vdoc-005',
                                name: 'Non-Disclosure Agreement',
                                type: 'mnda',
                                dateAdded: '2023-05-20T09:15:00Z',
                                status: 'accepted',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-05-20T09:15:00Z',
                                        by: 'admin@invent.us'
                                    },
                                    {
                                        action: 'accepted',
                                        date: '2023-05-23T10:10:00Z',
                                        by: 'info@techcorp.com'
                                    }
                                ]
                            }
                        ]
                    },
                    'vendor-003': {
                        vendorName: 'Globex Corporation',
                        vendorEmail: 'support@globex.com',
                        documents: [
                            {
                                id: 'vdoc-006',
                                name: 'Terms and Conditions',
                                type: 'terms',
                                dateAdded: '2023-05-25T13:40:00Z',
                                status: 'accepted',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-05-25T13:40:00Z',
                                        by: 'admin@invent.us'
                                    },
                                    {
                                        action: 'accepted',
                                        date: '2023-05-26T09:30:00Z',
                                        by: 'support@globex.com'
                                    }
                                ]
                            },
                            {
                                id: 'vdoc-007',
                                name: 'Vendor Agreement',
                                type: 'agreement',
                                dateAdded: '2023-05-25T13:40:00Z',
                                status: 'pending',
                                history: [
                                    {
                                        action: 'added',
                                        date: '2023-05-25T13:40:00Z',
                                        by: 'admin@invent.us'
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
            
            localStorage.setItem(adminStorageKey, JSON.stringify(initialAdminData));
            console.log('Initialized admin data in local storage.');
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
                return null;
            }
            return JSON.parse(storedData);
        } catch (error) {
            console.error('Error loading or parsing admin data:', error);
            return null;
        }
    }
    
    /**
     * Saves the admin data object back to local storage.
     * @param {object} adminData - The admin data object to save.
     * @returns {boolean} True if save was successful, false otherwise.
     */
    function saveAdminData(adminData) {
        if (!adminData) return false;
        try {
            localStorage.setItem(adminStorageKey, JSON.stringify(adminData));
            console.log('Admin data saved to local storage.');
            return true;
        } catch (error) {
            console.error('Error saving admin data:', error);
            return false;
        }
    }

    // Function to format dates to a readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Function to get relative time string
    function getRelativeTimeString(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffSeconds = Math.floor((now - date) / 1000);
        
        if (diffSeconds < 60) {
            return 'Just now';
        } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffSeconds < 86400) {
            const hours = Math.floor(diffSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffSeconds < 604800) {
            const days = Math.floor(diffSeconds / 86400);
            if (days === 1) return 'Yesterday';
            return `${days} days ago`;
        } else {
            return formatDate(dateString).split(' ')[0]; // Just the date part
        }
    }
}); 