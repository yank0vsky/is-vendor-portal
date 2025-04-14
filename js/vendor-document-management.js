/**
 * Vendor Document Management JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const adminStorageKey = 'inventStoreAdminData';
    const vendorStorageKey = 'inventStoreVendorData';
    
    // DOM Elements - Main Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM Elements - Subtabs
    const subtabButtons = document.querySelectorAll('.subtab-button');
    const subtabContents = document.querySelectorAll('.subtab-content');
    
    // DOM Elements - Default Documents Tab
    const defaultDocumentUploadForm = document.getElementById('default-document-upload-form');
    const defaultDocumentNameInput = document.getElementById('document-name');
    const defaultDocumentDescriptionInput = document.getElementById('document-description');
    const defaultDocumentFileInput = document.getElementById('document-file');
    const defaultSelectedFileName = document.getElementById('selected-file-name');
    const defaultDocumentsList = document.getElementById('default-documents-list');
    const defaultDocumentsHistoryList = document.getElementById('default-documents-history-list');
    
    // DOM Elements - Vendor Documents Tab
    const vendorSearch = document.getElementById('vendor-search');
    const vendorsList = document.getElementById('vendors-list');
    const vendorDocumentsContainer = document.getElementById('vendor-documents-container');
    const selectedVendorName = document.getElementById('selected-vendor-name');
    const selectedVendorEmail = document.getElementById('selected-vendor-email');
    const vendorHistoryName = document.getElementById('vendor-history-name');
    const vendorDocumentUploadForm = document.getElementById('vendor-document-upload-form');
    const vendorDocumentNameInput = document.getElementById('vendor-document-name');
    const vendorDocumentDescriptionInput = document.getElementById('vendor-document-description');
    const vendorDocumentFileInput = document.getElementById('vendor-document-file');
    const vendorSelectedFileName = document.getElementById('vendor-selected-file-name');
    const vendorDocumentsList = document.getElementById('vendor-documents-list');
    const vendorSpecificHistoryList = document.getElementById('vendor-specific-history-list');
    
    // DOM Elements - Modals
    const documentHistoryModal = document.getElementById('document-history-modal');
    const historyDocumentName = document.getElementById('history-document-name');
    const historyVendorName = document.getElementById('history-vendor-name');
    const historyTimelineList = document.getElementById('history-timeline-list');
    const documentPreviewModal = document.getElementById('document-preview-modal');
    const previewDocumentName = document.getElementById('preview-document-name');
    const documentPreviewIframe = document.getElementById('document-preview-iframe');
    const closeModalButtons = document.querySelectorAll('.close-modal-button, .close-button');
    
    // Variables to keep track of state
    let adminData = null;
    let selectedVendorId = 'vendor-001'; // Default to Acme Solutions
    let selectedDocumentId = null;
    let defaultHistoryData = []; // Will store default document history events
    let vendorHistoryData = {}; // Will store vendor-specific history events
    
    // Initialize and load data
    initialize();
    
    /**
     * Initializes the page and sets up event listeners.
     */
    function initialize() {
        // Load admin data
        adminData = loadAdminData();
        if (!adminData) {
            showError('Failed to load admin data. Please try refreshing the page.');
            return;
        }
        
        // Set up tab navigation
        setupTabNavigation();
        
        // Set up subtab navigation
        setupSubtabNavigation();
        
        // Set up file input handlers
        setupFileInputHandlers();
        
        // Set up form submission handlers
        setupFormSubmissionHandlers();
        
        // Set up modal close buttons
        setupModalCloseButtons();

        // Set up vendor selection
        setupVendorSelection();
        
        // Initialize history data
        initializeHistoryData();
    }
    
    /**
     * Sets up the tab navigation functionality.
     */
    function setupTabNavigation() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding tab content
                tabContents.forEach(content => {
                    if (content.id === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    /**
     * Sets up the subtab navigation functionality.
     */
    function setupSubtabNavigation() {
        subtabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const subtabId = button.getAttribute('data-subtab');
                const parentTab = button.closest('.tab-content');
                
                // Update active subtab button within this tab only
                const siblingButtons = parentTab.querySelectorAll('.subtab-button');
                siblingButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding subtab content
                const siblingContents = parentTab.querySelectorAll('.subtab-content');
                siblingContents.forEach(content => {
                    if (content.id === subtabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    /**
     * Sets up file input handlers for the file upload fields.
     */
    function setupFileInputHandlers() {
        // Default document file input
        if (defaultDocumentFileInput && defaultSelectedFileName) {
            defaultDocumentFileInput.addEventListener('change', (e) => {
                const fileName = e.target.files[0]?.name || 'MNDA_v2.pdf';
                defaultSelectedFileName.textContent = fileName;
            });
        }
        
        // Vendor document file input
        if (vendorDocumentFileInput && vendorSelectedFileName) {
            vendorDocumentFileInput.addEventListener('change', (e) => {
                const fileName = e.target.files[0]?.name || 'MNDA_v2.pdf';
                vendorSelectedFileName.textContent = fileName;
            });
        }
    }

    /**
     * Sets up vendor selection in the vendors list.
     */
    function setupVendorSelection() {
        const vendorItems = document.querySelectorAll('#vendors-list li');
        vendorItems.forEach(item => {
            item.addEventListener('click', () => {
                const vendorId = item.getAttribute('data-vendor-id');
                selectVendor(vendorId);

                // Update active vendor in the list
                vendorItems.forEach(vendorItem => {
                    if (vendorItem.getAttribute('data-vendor-id') === vendorId) {
                        vendorItem.classList.add('active');
                    } else {
                        vendorItem.classList.remove('active');
                    }
                });
            });
        });

        // Set up vendor search
        if (vendorSearch) {
            vendorSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                vendorItems.forEach(vendor => {
                    const vendorName = vendor.querySelector('.vendor-name').textContent.toLowerCase();
                    const vendorEmail = vendor.querySelector('.vendor-email').textContent.toLowerCase();
                    
                    if (vendorName.includes(searchTerm) || vendorEmail.includes(searchTerm)) {
                        vendor.style.display = '';
                    } else {
                        vendor.style.display = 'none';
                    }
                });
            });
        }
    }
    
    /**
     * Sets up form submission handlers for document upload forms.
     */
    function setupFormSubmissionHandlers() {
        // Default document upload form
        if (defaultDocumentUploadForm) {
            defaultDocumentUploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleDefaultDocumentUpload();
            });
        }
        
        // Vendor document upload form
        if (vendorDocumentUploadForm) {
            vendorDocumentUploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleVendorDocumentUpload();
            });
        }
    }
    
    /**
     * Sets up modal close buttons.
     */
    function setupModalCloseButtons() {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                documentHistoryModal.classList.add('hidden');
                documentPreviewModal.classList.add('hidden');
            });
        });
    }

    /**
     * Initializes the history data from all document activities.
     */
    function initializeHistoryData() {
        defaultHistoryData = [];
        vendorHistoryData = {};

        // Initialize vendor history containers
        if (adminData.vendorDocuments) {
            Object.keys(adminData.vendorDocuments).forEach(vendorId => {
                vendorHistoryData[vendorId] = [];
            });
        }

        // Add default document history
        if (adminData.defaultDocuments) {
            adminData.defaultDocuments.forEach(doc => {
                defaultHistoryData.push({
                    type: 'admin',
                    action: 'added',
                    title: 'Document Added',
                    details: `Admin <strong>${adminData.user.name} (${adminData.user.email})</strong> added default document <strong>${doc.name}</strong>`,
                    date: doc.dateAdded,
                    documentId: doc.id
                });
            });
        }

        // Sort default history by date, newest first
        defaultHistoryData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Add vendor document history
        if (adminData.vendorDocuments) {
            Object.entries(adminData.vendorDocuments).forEach(([vendorId, vendorData]) => {
                if (vendorData.documents) {
                    vendorData.documents.forEach(doc => {
                        if (doc.history) {
                            doc.history.forEach(historyItem => {
                                let actionTitle = '';
                                let actionDetails = '';

                                switch (historyItem.action) {
                                    case 'added':
                                        actionTitle = 'Document Added';
                                        actionDetails = `Admin <strong>${adminData.user.name} (${adminData.user.email})</strong> added document <strong>${doc.name}</strong> for vendor <strong>${vendorData.vendorName}</strong>`;
                                        break;
                                    case 'updated':
                                        actionTitle = 'Document Updated';
                                        actionDetails = `Admin <strong>${adminData.user.name} (${adminData.user.email})</strong> updated document <strong>${doc.name}</strong> for vendor <strong>${vendorData.vendorName}</strong>`;
                                        break;
                                    case 'accepted':
                                        actionTitle = 'Document Accepted';
                                        actionDetails = `Vendor <strong>${vendorData.vendorName}</strong> accepted document <strong>${doc.name}</strong>`;
                                        break;
                                    case 'rejected':
                                        actionTitle = 'Document Rejected';
                                        actionDetails = `Vendor <strong>${vendorData.vendorName}</strong> rejected document <strong>${doc.name}</strong>`;
                                        break;
                                }

                                vendorHistoryData[vendorId].push({
                                    type: historyItem.by === adminData.user.email ? 'admin' : 'vendor',
                                    action: historyItem.action,
                                    title: actionTitle,
                                    details: actionDetails,
                                    date: historyItem.date,
                                    documentId: doc.id
                                });
                            });
                        }
                    });

                    // Sort vendor history by date, newest first
                    vendorHistoryData[vendorId].sort((a, b) => new Date(b.date) - new Date(a.date));
                }
            });
        }

        // Render default document history
        renderDefaultHistory();
        
        // Render initial vendor history (for Acme Solutions)
        renderVendorHistory(selectedVendorId);
    }

    /**
     * Renders the default documents history with the provided items.
     */
    function renderDefaultHistory() {
        defaultDocumentsHistoryList.innerHTML = '';

        if (defaultHistoryData.length === 0) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<p class="action-title">No history items found</p>`;
            defaultDocumentsHistoryList.appendChild(listItem);
            return;
        }

        defaultHistoryData.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p class="action-title">${item.title}</p>
                <p class="action-details">${item.details}</p>
                <p class="action-time">${formatDate(item.date)}</p>
            `;
            defaultDocumentsHistoryList.appendChild(listItem);
        });
    }

    /**
     * Renders the vendor-specific history for the specified vendor.
     * @param {string} vendorId - The ID of the vendor to render history for.
     */
    function renderVendorHistory(vendorId) {
        if (!vendorHistoryData[vendorId]) return;
        
        vendorSpecificHistoryList.innerHTML = '';

        if (vendorHistoryData[vendorId].length === 0) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<p class="action-title">No history items found for this vendor</p>`;
            vendorSpecificHistoryList.appendChild(listItem);
            return;
        }

        vendorHistoryData[vendorId].forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p class="action-title">${item.title}</p>
                <p class="action-details">${item.details}</p>
                <p class="action-time">${formatDate(item.date)}</p>
            `;
            vendorSpecificHistoryList.appendChild(listItem);
        });
    }

    /**
     * Handles the upload of a default document.
     */
    function handleDefaultDocumentUpload() {
        // Use predefined values for the MNDA document
        const documentName = "MNDA_v2";
        const documentDescription = "Mutual Non-Disclosure Agreement (Version 2)";
        const fileName = "MNDA_v2.pdf";
        
        // Create new document row in the table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${documentName}</td>
            <td>${documentDescription}</td>
            <td>${formatDate(new Date().toISOString())}</td>
            <td>${adminData.user.email}</td>
            <td class="document-actions">
                <button class="action-icon" title="Preview Document"><i class="fas fa-eye"></i></button>
                <button class="action-icon" title="Update Document"><i class="fas fa-pen"></i></button>
                <button class="action-icon delete" title="Delete Document"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;

        // Add event listeners to the buttons
        const previewButton = newRow.querySelector('.action-icon');
        previewButton.addEventListener('click', () => {
            previewDocumentName.textContent = documentName;
            documentPreviewIframe.srcdoc = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                        </style>
                    </head>
                    <body>
                        <h4>${documentName}</h4>
                        <p>${documentDescription}</p>
                        <p>This is a placeholder for the uploaded document: ${fileName}</p>
                    </body>
                </html>
            `;
            documentPreviewModal.classList.remove('hidden');
        });

        // Add to the table
        defaultDocumentsList.appendChild(newRow);

        // Add to history
        const historyItem = {
            type: 'admin',
            action: 'added',
            title: 'Document Added',
            details: `Admin <strong>${adminData.user.name} (${adminData.user.email})</strong> added default document <strong>${documentName}</strong>`,
            date: new Date().toISOString(),
            documentId: 'doc-' + Date.now()
        };
        
        defaultHistoryData.unshift(historyItem);
        renderDefaultHistory();
        
        // Clear form
        defaultDocumentUploadForm.reset();
        defaultSelectedFileName.textContent = 'MNDA_v2.pdf';
        
        alert('Document uploaded successfully!');
    }
    
    /**
     * Handles the upload of a vendor-specific document.
     */
    function handleVendorDocumentUpload() {
        if (!selectedVendorId) {
            alert('Please select a vendor first.');
            return;
        }
        
        // Use predefined values for the MNDA document
        const documentName = "MNDA_v2";
        const documentDescription = "Mutual Non-Disclosure Agreement (Version 2)";
        const fileName = "MNDA_v2.pdf";
        
        // Create new document row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${documentName}</td>
            <td>${documentDescription}</td>
            <td>${formatDate(new Date().toISOString())}</td>
            <td><span class="status-indicator status-pending"><i class="fas fa-clock"></i> Pending</span></td>
            <td class="document-actions">
                <button class="action-icon" title="Preview Document"><i class="fas fa-eye"></i></button>
                <button class="action-icon" title="View History"><i class="fas fa-history"></i></button>
                <button class="action-icon" title="Update Document"><i class="fas fa-pen"></i></button>
                <button class="action-icon delete" title="Delete Document"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;

        // Add event listeners to buttons
        const previewButton = newRow.querySelector('.action-icon');
        previewButton.addEventListener('click', () => {
            const vendorData = adminData.vendorDocuments[selectedVendorId];
            previewDocumentName.textContent = `${documentName} (${vendorData.vendorName})`;
            documentPreviewIframe.srcdoc = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                        </style>
                    </head>
                    <body>
                        <h4>${documentName}</h4>
                        <p>${documentDescription}</p>
                        <p>This is a placeholder for the vendor document: ${fileName}</p>
                        <p><strong>Vendor:</strong> ${vendorData.vendorName}</p>
                        <p><strong>Status:</strong> Pending</p>
                        <p><strong>Date Added:</strong> ${formatDate(new Date().toISOString())}</p>
                    </body>
                </html>
            `;
            documentPreviewModal.classList.remove('hidden');
        });

        // Add to the table
        vendorDocumentsList.appendChild(newRow);

        // Add to history
        const vendorData = adminData.vendorDocuments[selectedVendorId];
        const historyItem = {
            type: 'admin',
            action: 'added',
            title: 'Document Added',
            details: `Admin <strong>${adminData.user.name} (${adminData.user.email})</strong> added document <strong>${documentName}</strong> for vendor <strong>${vendorData.vendorName}</strong>`,
            date: new Date().toISOString(),
            documentId: 'vdoc-' + Date.now()
        };
        
        // Ensure the vendor has a history array
        if (!vendorHistoryData[selectedVendorId]) {
            vendorHistoryData[selectedVendorId] = [];
        }
        
        vendorHistoryData[selectedVendorId].unshift(historyItem);
        renderVendorHistory(selectedVendorId);
        
        // Clear form
        vendorDocumentUploadForm.reset();
        vendorSelectedFileName.textContent = 'MNDA_v2.pdf';
        
        alert('Document uploaded successfully!');
    }
    
    /**
     * Selects a vendor and loads their document data.
     * @param {string} vendorId - The ID of the vendor to select.
     */
    function selectVendor(vendorId) {
        if (!adminData || !adminData.vendorDocuments) {
            showError('Failed to load vendor data.');
            return;
        }
        
        // If specific vendor not found, use the first available vendor
        if (!adminData.vendorDocuments[vendorId]) {
            console.warn(`Vendor ID ${vendorId} not found.`);
            const availableVendors = Object.keys(adminData.vendorDocuments);
            if (availableVendors.length > 0) {
                vendorId = availableVendors[0];
                console.log(`Using first available vendor: ${vendorId}`);
            } else {
                showError('No vendors available.');
                return;
            }
        }
        
        // Update selected vendor ID
        selectedVendorId = vendorId;
        
        // Update vendor info in the documents section
        const vendorData = adminData.vendorDocuments[vendorId];
        if (selectedVendorName) selectedVendorName.textContent = vendorData.vendorName;
        if (selectedVendorEmail) selectedVendorEmail.textContent = vendorData.vendorEmail;
        if (vendorHistoryName) vendorHistoryName.textContent = vendorData.vendorName;
        
        // Render vendor documents
        renderVendorDocuments(vendorId);
        
        // Render vendor history
        renderVendorHistory(vendorId);
    }
    
    /**
     * Shows an error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        alert(message);
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
                    description: 'Standard terms for all vendors',
                    dateAdded: '2023-05-15T10:30:00Z',
                    addedBy: 'admin@invent.us'
                },
                {
                    id: 'doc-002',
                    name: 'Vendor Agreement',
                    description: 'Legal agreement for all vendors',
                    dateAdded: '2023-05-16T14:20:00Z',
                    addedBy: 'admin@invent.us'
                },
                {
                    id: 'doc-003',
                    name: 'Non-Disclosure Agreement',
                    description: 'Confidentiality agreement',
                    dateAdded: '2023-05-17T09:45:00Z',
                    addedBy: 'admin@invent.us'
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
                            description: 'Standard terms for Acme Solutions',
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
                            description: 'Legal agreement for Acme Solutions',
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
     * Formats a date string to a human-readable format.
     * @param {string} dateString - The ISO date string to format.
     * @returns {string} The formatted date string.
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Renders the documents for a specific vendor.
     * @param {string} vendorId - The ID of the vendor.
     */
    function renderVendorDocuments(vendorId) {
        if (!vendorDocumentsList) return;
        
        vendorDocumentsList.innerHTML = '';
        
        // Show vendor documents container if it exists
        if (vendorDocumentsContainer) {
            vendorDocumentsContainer.classList.remove('hidden');
        }
        
        // Update vendor profile link if it exists
        const vendorProfileLink = document.getElementById('vendor-profile-link');
        if (vendorProfileLink) {
            vendorProfileLink.href = `vendor-profile.html?id=${vendorId}`;
        }
        
        const vendorData = adminData.vendorDocuments[vendorId];
        
        if (!vendorData.documents || vendorData.documents.length === 0) {
            vendorDocumentsList.innerHTML = '<tr><td colspan="5" class="empty-state">No documents found for this vendor.</td></tr>';
            return;
        }
        
        vendorData.documents.forEach(document => {
            const row = document.createElement('tr');
            
            const statusClass = document.status === 'accepted' ? 'status-accepted' : 
                               document.status === 'rejected' ? 'status-rejected' : 'status-pending';
            
            row.innerHTML = `
                <td>${document.name}</td>
                <td>${document.description}</td>
                <td>${formatDate(document.dateAdded)}</td>
                <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(document.status)}</span></td>
                <td>
                    <button class="action-icon preview-document" data-document-id="${document.id}" title="Preview Document"><i class="fas fa-eye"></i></button>
                    <button class="action-icon view-history" data-document-id="${document.id}" data-vendor-id="${vendorId}" title="View History"><i class="fas fa-history"></i></button>
                    <button class="action-icon download-document" data-document-id="${document.id}" title="Download Document"><i class="fas fa-download"></i></button>
                </td>
            `;
            
            vendorDocumentsList.appendChild(row);
        });
        
        // Add event listeners to the action buttons
        setupDocumentActionButtons();
    }

    /**
     * Sets up event listeners for document action buttons (preview, history, download)
     */
    function setupDocumentActionButtons() {
        // Preview document buttons
        const previewButtons = document.querySelectorAll('.preview-document');
        previewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const documentId = button.getAttribute('data-document-id');
                previewDocument(documentId);
            });
        });
        
        // View history buttons
        const historyButtons = document.querySelectorAll('.view-history');
        historyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const documentId = button.getAttribute('data-document-id');
                const vendorId = button.getAttribute('data-vendor-id');
                viewDocumentHistory(documentId, vendorId);
            });
        });
        
        // Download document buttons
        const downloadButtons = document.querySelectorAll('.download-document');
        downloadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const documentId = button.getAttribute('data-document-id');
                downloadDocument(documentId);
            });
        });
    }

    /**
     * Preview a document (simplified for prototype)
     * @param {string} documentId - The ID of the document to preview
     */
    function previewDocument(documentId) {
        // In a real app, we would fetch the document from the server
        // For the prototype, we'll show a mock PDF viewer
        if (documentPreviewModal && previewDocumentName) {
            documentPreviewModal.style.display = 'block';
            previewDocumentName.textContent = 'Document Preview';
            
            // Set iframe source to a mock PDF
            if (documentPreviewIframe) {
                documentPreviewIframe.src = 'https://via.placeholder.com/800x1000?text=Document+Preview';
            }
        }
    }

    /**
     * View document history (simplified for prototype)
     * @param {string} documentId - The ID of the document
     * @param {string} vendorId - The ID of the vendor
     */
    function viewDocumentHistory(documentId, vendorId) {
        if (!documentHistoryModal) return;
        
        const vendorData = adminData.vendorDocuments[vendorId];
        const document = vendorData.documents.find(doc => doc.id === documentId);
        
        if (!document) {
            console.error(`Document ${documentId} not found for vendor ${vendorId}`);
            return;
        }
        
        documentHistoryModal.style.display = 'block';
        
        if (historyDocumentName) historyDocumentName.textContent = document.name;
        if (historyVendorName) historyVendorName.textContent = vendorData.vendorName;
        
        if (historyTimelineList) {
            historyTimelineList.innerHTML = '';
            
            if (!document.history || document.history.length === 0) {
                historyTimelineList.innerHTML = '<li class="empty-state">No history events found for this document.</li>';
                return;
            }
            
            document.history.forEach(event => {
                const item = document.createElement('li');
                item.className = 'timeline-item';
                
                item.innerHTML = `
                    <div class="timeline-content">
                        <h3>${capitalizeFirstLetter(event.action)}</h3>
                        <p>${formatDate(event.date)}</p>
                        <p>By: ${event.by}</p>
                    </div>
                `;
                
                historyTimelineList.appendChild(item);
            });
        }
    }

    /**
     * Download a document (simplified for prototype)
     * @param {string} documentId - The ID of the document to download
     */
    function downloadDocument(documentId) {
        alert('Document download initiated (simulated).');
        console.log(`Downloading document ${documentId}`);
    }

    /**
     * Capitalizes the first letter of a string.
     * @param {string} string - The string to capitalize.
     * @returns {string} The capitalized string.
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}); 