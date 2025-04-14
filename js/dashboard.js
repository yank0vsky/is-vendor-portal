/**
 * Dashboard specific JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'inventStoreVendorData';
    let vendorData = null; // Holds the entire object { name, ..., documents: {...}, projects: [...] }

    // --- Element References ---
    const vendorNameEl = document.getElementById('vendor-name');
    const vendorCompanyEl = document.getElementById('vendor-company');
    const vendorRoleEl = document.getElementById('vendor-role');
    const documentListEl = document.getElementById('document-list');
    const buildingGuidesSection = document.getElementById('building-guides-section');
    const buildingGuidesStatusMessage = buildingGuidesSection?.querySelector('.status-message');
    const projectsSection = document.querySelector('.projects-section');
    const projectsStatusMessage = document.getElementById('projects-status-message');
    const createProjectButton = document.getElementById('create-project-button');
    const newProjectForm = document.getElementById('new-project-form');
    const cancelProjectButton = document.getElementById('cancel-create-project');
    const projectsListContainer = document.getElementById('projects-list-container');
    const projectsListUl = document.getElementById('projects-list');
    const projectNameInput = document.getElementById('project-name');
    const projectDescInput = document.getElementById('project-description');
    const docsChangeRequestNote = document.getElementById('docs-change-request-note');
    const docsAgreementChangeNote = document.getElementById('docs-agreement-change-note');

    // Modal Elements
    const documentModal = document.getElementById('document-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-document-title');
    const modalContent = document.getElementById('modal-document-content');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalAgreeButton = document.getElementById('modal-agree-button');
    const scrollIndicator = document.getElementById('scroll-indicator');

    // Create Project Modal Elements
    const createProjectModalContainer = document.getElementById('create-project-modal-container');
    const createProjectModalOverlay = document.getElementById('create-project-modal-overlay');
    const createProjectCloseBtn = document.getElementById('create-project-close-btn');
    const saveProjectBtn = document.getElementById('save-project-btn');

    // --- Document Definitions ---
    const documents = [
        { 
            key: 'terms', 
            name: 'Terms and Conditions',
            content: `
                <h4>Terms and Conditions</h4>
                <p>This is a placeholder for the Terms and Conditions document. In a real application, this would contain the actual legal text.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p>
                <p>Phasellus vulputate eros sed felis bibendum, nec condimentum ipsum dapibus. Aenean nisi urna, aliquam sit amet tempus non, interdum a est. Morbi blandit nunc id lorem accumsan, non malesuada massa vestibulum.</p>
                <p>Donec id ex nec nisl dapibus tincidunt. Curabitur fermentum nisl nunc, non ultricies eros sollicitudin non. Vivamus efficitur nisl id ex imperdiet, ut cursus augue consequat.</p>
                <p>Suspendisse potenti. Suspendisse potenti. Curabitur facilisis eleifend tellus, vitae viverra enim egestas non. Maecenas sit amet risus eu ex lobortis efficitur.</p>
                <p>Donec eu dolor eget velit mollis varius. Proin auctor, velit et suscipit tincidunt, ipsum purus ornare sapien, quis eleifend quam lorem vel massa. Mauris commodo turpis at metus feugiat vulputate.</p>
                <p>Cras imperdiet tellus vel lacus congue, ac auctor nulla iaculis. Ut in ex malesuada, congue nisi non, imperdiet neque.</p>
                <p>Fusce quis velit non nulla sagittis mattis. Sed efficitur magna dolor, non consectetur nisl dictum at. Donec dolor mi, condimentum eu tincidunt nec, tincidunt eget magna.</p>
                <p>Suspendisse potenti. Donec facilisis nisl quis erat tincidunt gravida. Mauris rutrum faucibus viverra. Morbi sit amet interdum nulla.</p>
                <p>You have now reached the end of this document.</p>
            `
        },
        { 
            key: 'agreement', 
            name: 'Marketplace Agreement',
            content: `
                <h4>Marketplace Agreement</h4>
                <p>This is a placeholder for the Marketplace Agreement document. In a real application, this would contain the actual legal text.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p>
                <p>Phasellus vulputate eros sed felis bibendum, nec condimentum ipsum dapibus. Aenean nisi urna, aliquam sit amet tempus non, interdum a est. Morbi blandit nunc id lorem accumsan, non malesuada massa vestibulum.</p>
                <p>Donec id ex nec nisl dapibus tincidunt. Curabitur fermentum nisl nunc, non ultricies eros sollicitudin non. Vivamus efficitur nisl id ex imperdiet, ut cursus augue consequat.</p>
                <p>Suspendisse potenti. Suspendisse potenti. Curabitur facilisis eleifend tellus, vitae viverra enim egestas non. Maecenas sit amet risus eu ex lobortis efficitur.</p>
                <p>Donec eu dolor eget velit mollis varius. Proin auctor, velit et suscipit tincidunt, ipsum purus ornare sapien, quis eleifend quam lorem vel massa. Mauris commodo turpis at metus feugiat vulputate.</p>
                <p>Cras imperdiet tellus vel lacus congue, ac auctor nulla iaculis. Ut in ex malesuada, congue nisi non, imperdiet neque.</p>
                <p>Fusce quis velit non nulla sagittis mattis. Sed efficitur magna dolor, non consectetur nisl dictum at. Donec dolor mi, condimentum eu tincidunt nec, tincidunt eget magna.</p>
                <p>Suspendisse potenti. Donec facilisis nisl quis erat tincidunt gravida. Mauris rutrum faucibus viverra. Morbi sit amet interdum nulla.</p>
                <p>You have now reached the end of this document.</p>
            `
        },
        { 
            key: 'mnda', 
            name: 'MNDA',
            content: `
                <h4>Mutual Non-Disclosure Agreement (MNDA)</h4>
                <p>This is a placeholder for the MNDA document. In a real application, this would contain the actual legal text.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p>
                <p>Phasellus vulputate eros sed felis bibendum, nec condimentum ipsum dapibus. Aenean nisi urna, aliquam sit amet tempus non, interdum a est. Morbi blandit nunc id lorem accumsan, non malesuada massa vestibulum.</p>
                <p>Donec id ex nec nisl dapibus tincidunt. Curabitur fermentum nisl nunc, non ultricies eros sollicitudin non. Vivamus efficitur nisl id ex imperdiet, ut cursus augue consequat.</p>
                <p>Suspendisse potenti. Suspendisse potenti. Curabitur facilisis eleifend tellus, vitae viverra enim egestas non. Maecenas sit amet risus eu ex lobortis efficitur.</p>
                <p>Donec eu dolor eget velit mollis varius. Proin auctor, velit et suscipit tincidunt, ipsum purus ornare sapien, quis eleifend quam lorem vel massa. Mauris commodo turpis at metus feugiat vulputate.</p>
                <p>Cras imperdiet tellus vel lacus congue, ac auctor nulla iaculis. Ut in ex malesuada, congue nisi non, imperdiet neque.</p>
                <p>Fusce quis velit non nulla sagittis mattis. Sed efficitur magna dolor, non consectetur nisl dictum at. Donec dolor mi, condimentum eu tincidunt nec, tincidunt eget magna.</p>
                <p>Suspendisse potenti. Donec facilisis nisl quis erat tincidunt gravida. Mauris rutrum faucibus viverra. Morbi sit amet interdum nulla.</p>
                <p>You have now reached the end of this document.</p>
            `
        }
    ];

    // Current document being viewed
    let currentDocumentKey = null;

    /**
     * Loads vendor data from local storage. Ensures 'projects' array exists.
     * @returns {object | null} The vendor data object or null if not found/invalid.
     */
    function loadVendorData() {
        try {
            const storedData = localStorage.getItem(storageKey);
            if (!storedData) {
                console.warn('No vendor data found in local storage. Redirecting to register.');
                window.location.href = 'register.html';
                return null;
            }
            let data = JSON.parse(storedData);
            if (!data.projects) {
                data.projects = [];
            }
            if (!data.documents) {
                data.documents = { terms: false, agreement: false, mnda: false };
            }
            return data;
        } catch (error) {
            console.error('Error loading or parsing vendor data:', error);
            alert('Error loading vendor data. Please try registering again.');
            window.location.href = 'register.html';
            return null;
        }
    }

    /**
     * Saves the current vendorData object back to local storage.
     * @returns {boolean} True if save was successful, false otherwise.
     */
    function saveVendorData() {
        if (!vendorData) return false;
        try {
            localStorage.setItem(storageKey, JSON.stringify(vendorData));
            console.log('Vendor data saved to local storage.');
            return true;
        } catch (error) {
            console.error('Error saving vendor data:', error);
            alert('Could not save data to local storage.');
            return false;
        }
    }

    /**
     * Updates the Vendor Status section in the UI.
     */
    function updateVendorStatusUI() {
        if (vendorData && vendorNameEl && vendorCompanyEl && vendorRoleEl) {
            // Combine first and last name for display
            const fullName = `${vendorData.firstName || ''} ${vendorData.lastName || ''}`.trim() || 'N/A';
            vendorNameEl.textContent = fullName;
            vendorCompanyEl.textContent = vendorData.company || 'N/A';
            vendorRoleEl.textContent = vendorData.role || 'N/A';
        } else if (vendorNameEl && vendorCompanyEl && vendorRoleEl) {
            vendorNameEl.textContent = 'Error loading';
            vendorCompanyEl.textContent = 'Error loading';
            vendorRoleEl.textContent = 'Error loading';
        }
    }

    /**
     * Checks if all required documents have been agreed to.
     * @returns {boolean} True if all documents are agreed to, false otherwise.
     */
    function checkAllDocumentsAgreed() {
        if (!vendorData || !vendorData.documents) {
            return false;
        }
        return documents.every(doc => vendorData.documents[doc.key] === true);
    }

    /**
     * Updates the enabled/disabled state of the "Create New Project" button
     * and the visibility of the status message. Also handles the gated content state.
     */
    function updateFeatureAvailability() {
        const allAgreed = checkAllDocumentsAgreed();

        // --- Project Creation Button ---
        if (createProjectButton) {
            createProjectButton.disabled = !allAgreed;
            if (!allAgreed) {
                createProjectButton.title = 'You must read and agree to all documents first to get started with project creation';
            } else {
                createProjectButton.removeAttribute('title');
            }
        }

        // --- Gated Content Sections (Building Guides & Projects) ---
        [buildingGuidesSection, projectsSection].forEach(section => {
            if (section) {
                // Toggle the 'inactive-section' class based on agreement
                section.classList.toggle('inactive-section', !allAgreed);

                // Find the status message within *this* section
                const statusMessage = section.querySelector('.status-message');
                if (statusMessage) {
                    // Show message only when not agreed
                    statusMessage.classList.toggle('hidden', allAgreed);
                }
            } else {
                 console.warn("A gated section element was not found.");
            }
        });

        // --- Document Section Notes ---
        // Toggle document notes visibility based on agreement status
        if (docsChangeRequestNote) {
            docsChangeRequestNote.classList.toggle('hidden', allAgreed);
        }
        if (docsAgreementChangeNote) {
            docsAgreementChangeNote.classList.toggle('hidden', !allAgreed);
        }

        // Ensure the create form is hidden if docs are not agreed to (edge case)
        if (!allAgreed && newProjectForm && !newProjectForm.classList.contains('hidden')) {
             newProjectForm.classList.add('hidden');
             if (createProjectButton) createProjectButton.style.display = 'block'; // Show button again
        }
    }

    /**
     * Opens the document modal with the specified document.
     * @param {string} docKey - The key of the document to display.
     */
    function openDocumentModal(docKey) {
        const doc = documents.find(d => d.key === docKey);
        if (!doc) {
            console.error(`Document with key '${docKey}' not found.`);
            return;
        }

        // Set current document key
        currentDocumentKey = docKey;
        
        // Reset scroll state and button
        modalAgreeButton.disabled = true;
        scrollIndicator.style.display = 'flex';
        
        // Populate modal
        modalTitle.textContent = doc.name;
        modalContent.innerHTML = doc.content;
        
        // Show modal
        documentModal.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');
        
        // Add scroll event listener
        modalContent.addEventListener('scroll', checkScrollPosition);
    }

    /**
     * Checks if the user has scrolled to the bottom of the document.
     */
    function checkScrollPosition() {
        // Check if scrolled to bottom (or near bottom)
        const isAtBottom = 
            modalContent.scrollHeight - modalContent.scrollTop <= 
            modalContent.clientHeight + 20; // Adding 20px tolerance
        
        if (isAtBottom) {
            // User has reached the bottom, enable the agree button
            modalAgreeButton.disabled = false;
            scrollIndicator.style.display = 'none';
            
            // Remove the scroll event listener once we've hit bottom
            modalContent.removeEventListener('scroll', checkScrollPosition);
        }
    }

    /**
     * Closes the document modal.
     */
    function closeDocumentModal() {
        documentModal.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
        modalContent.removeEventListener('scroll', checkScrollPosition);
        currentDocumentKey = null;
    }

    /**
     * Handles the click event on the "I've read and agree" button.
     */
    function handleDocumentAgreement() {
        if (!vendorData || !vendorData.documents || !currentDocumentKey) return;

        vendorData.documents[currentDocumentKey] = true;

        if (saveVendorData()) {
            console.log(`Document '${currentDocumentKey}' marked as read and agreed.`);
            closeDocumentModal();
            renderDocumentList();
            updateFeatureAvailability();
        } else {
            // Revert if save failed
            vendorData.documents[currentDocumentKey] = false;
            alert('Failed to save document agreement.');
        }
    }

    /**
     * Renders the list of documents in the UI.
     */
    function renderDocumentList() {
        if (!documentListEl || !vendorData || typeof vendorData.documents !== 'object') {
            if (documentListEl) documentListEl.innerHTML = '<li>Error loading document status.</li>';
            console.error("Cannot render documents: list element or vendor document data missing/invalid.");
            return;
        }
        
        documentListEl.innerHTML = '';
        
        documents.forEach(doc => {
            const isAgreed = vendorData.documents[doc.key] === true;
            const listItem = document.createElement('li');
            listItem.setAttribute('data-doc-key', doc.key);
            
            // Document name
            const docName = document.createTextNode(`${doc.name} `);
            listItem.appendChild(docName);
            
            // Status indicator
            const statusEl = document.createElement('span');
            statusEl.className = `document-status ${isAgreed ? 'completed' : ''}`;
            if (isAgreed) {
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Done';
            } else {
                statusEl.textContent = 'Required';
            }
            listItem.appendChild(statusEl);
            
            // Open document button
            const openButton = document.createElement('button');
            openButton.className = 'open-document-button';
            openButton.textContent = isAgreed ? 'View' : 'Open';
            openButton.addEventListener('click', () => openDocumentModal(doc.key));
            listItem.appendChild(openButton);
            
            documentListEl.appendChild(listItem);
        });
    }

    /**
     * Renders the list of projects in the UI.
     */
     function renderProjectsList() {
        if (!projectsListUl || !vendorData || !Array.isArray(vendorData.projects)) {
             console.error("Project list element or data not found/invalid for rendering.");
             if (projectsListUl) projectsListUl.innerHTML = '<li>Could not load projects.</li>';
              // Ensure container visibility reflects error/no data state
             if (projectsListContainer) projectsListContainer.classList.add('hidden');
             return;
         }

         projectsListUl.innerHTML = ''; // Clear current list

         if (vendorData.projects.length === 0) {
             projectsListUl.innerHTML = '<li class="no-projects">No projects created yet.</li>';
             // Hide the container if list is empty
             if (projectsListContainer) projectsListContainer.classList.add('hidden');

         } else {
             // Add table header if we have projects
             const tableHeader = document.createElement('li');
             tableHeader.className = 'project-list-header';
             tableHeader.innerHTML = `
                <div class="project-name-col">Project Name</div>
                <div class="project-status-col">Project Status</div>
                <div class="project-actions-col">Actions</div>
             `;
             projectsListUl.appendChild(tableHeader);
             
             vendorData.projects.forEach(project => {
                 const listItem = document.createElement('li');
                 listItem.className = 'project-list-item';
                 
                 // Project name column
                 const nameCol = document.createElement('div');
                 nameCol.className = 'project-name-col';
                 
                 const link = document.createElement('a');
                 if (project.id) {
                    link.href = `project.html?id=${project.id}`;
                 } else {
                    link.href = '#'; 
                    console.warn("Project missing ID:", project);
                 }
                 link.textContent = project.name || 'Unnamed Project'; 
                 nameCol.appendChild(link);
                 listItem.appendChild(nameCol);
                 
                 // Status column (Combined)
                 const statusCol = document.createElement('div');
                 statusCol.className = 'project-status-col';

                 // Marketing Status
                 const marketingStatusDiv = document.createElement('div');
                 marketingStatusDiv.className = 'status-line';
                 const marketingIcon = document.createElement('i');
                 marketingIcon.className = 'fas';
                 const marketingText = document.createElement('span');
                 if (project.appStatistics && project.appStatistics.hasMarketingListing) {
                     marketingIcon.classList.add('fa-check-circle', 'status-icon-active');
                     marketingText.textContent = ' Listed on Invent Store';
                 } else {
                     marketingIcon.classList.add('fa-times-circle', 'status-icon-inactive');
                     marketingText.textContent = ' Not listed';
                 }
                 marketingStatusDiv.appendChild(marketingIcon);
                 marketingStatusDiv.appendChild(marketingText);
                 statusCol.appendChild(marketingStatusDiv);

                 // App Connection Status
                 const appStatusDiv = document.createElement('div');
                 appStatusDiv.className = 'status-line';
                 const appIcon = document.createElement('i');
                 appIcon.className = 'fas';
                 const appText = document.createElement('span');
                 if (project.hasConnectedApp) {
                     appIcon.classList.add('fa-check-circle', 'status-icon-active');
                     appText.textContent = ' App connected';
                 } else {
                     appIcon.classList.add('fa-times-circle', 'status-icon-inactive');
                     appText.textContent = ' App not connected';
                 }
                 appStatusDiv.appendChild(appIcon);
                 appStatusDiv.appendChild(appText);
                 statusCol.appendChild(appStatusDiv);
                 
                 listItem.appendChild(statusCol);
                 
                 // Actions column
                 const actionsCol = document.createElement('div');
                 actionsCol.className = 'project-actions-col';
                 
                 const statsButton = document.createElement('button');
                 statsButton.className = 'stats-button';
                 statsButton.innerHTML = '<i class="fas fa-chart-line"></i> View Statistics';
                 statsButton.title = 'View app performance metrics';
                 statsButton.addEventListener('click', (e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     if (project.id) {
                         window.location.href = `project-statistics.html?id=${project.id}`;
                     } else {
                         console.error("Cannot navigate to statistics: Project ID missing.");
                         alert("Error: Cannot view statistics for this project.");
                     }
                 });
                 
                 actionsCol.appendChild(statsButton);
                 listItem.appendChild(actionsCol);
                 
                 projectsListUl.appendChild(listItem);
             });
             // Show the container if list has items
             if (projectsListContainer) projectsListContainer.classList.remove('hidden');
         }
     }

    /**
     * Opens the Create Project modal
     */
    function openCreateProjectModal() {
        if (!createProjectModalContainer) {
            console.error('Create project modal container not found');
            return;
        }
        
        // Ensure the form exists and is visible
        if (newProjectForm) {
            // Reset form fields
            newProjectForm.reset();
            // Always remove 'hidden' class in case it was previously added
            newProjectForm.classList.remove('hidden');
            // Make sure form is visible
            newProjectForm.style.display = 'block';
        } else {
            console.error('Project form not found in modal');
            return;
        }
        
        // Show modal
        createProjectModalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Focus on the project name input after modal is visible
        if (projectNameInput) {
            setTimeout(() => {
                projectNameInput.focus();
            }, 100); // Small delay to ensure the modal is visible
        } else {
            console.error('Project name input field not found');
            return;
        }
    }

    /**
     * Closes the Create Project modal
     */
    function closeCreateProjectModal() {
        if (!createProjectModalContainer) return;
        
        createProjectModalContainer.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }

    /**
     * Creates a new project based on the form data
     */
    function createNewProject() {
        if (!projectNameInput) {
            console.error('Project name input element not found');
            return;
        }
        
        const projectName = projectNameInput.value.trim();
        if (!projectName) {
            alert('Please enter a project name.');
            return;
        }
        
        const projectDescription = projectDescInput ? projectDescInput.value.trim() : '';
        
        const newProject = {
            id: Date.now().toString(), // Simple ID based on timestamp
            name: projectName,
            description: projectDescription,
            createdAt: new Date().toISOString(),
            members: [
                {
                    name: `${vendorData.firstName || ''} ${vendorData.lastName || ''}`.trim(),
                    email: vendorData.email,
                    role: 'manager',
                    status: 'Active'
                }
            ]
        };
        
        vendorData.projects.push(newProject);
        
        if (saveVendorData()) {
            renderProjectsList();
            closeCreateProjectModal();
        } else {
            alert('Failed to save the new project. Please try again.');
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Document modal events
        if (modalCloseButton) {
            modalCloseButton.addEventListener('click', closeDocumentModal);
        }
        if (modalAgreeButton) {
            modalAgreeButton.addEventListener('click', handleDocumentAgreement);
        }
        if (modalContent) {
            modalContent.addEventListener('scroll', checkScrollPosition);
        }
        
        // Create project button
        if (createProjectButton) {
            createProjectButton.addEventListener('click', () => {
                if (createProjectButton.disabled) return;
                openCreateProjectModal();
            });
        }
        
        // Create project modal close button
        if (createProjectCloseBtn) {
            createProjectCloseBtn.addEventListener('click', closeCreateProjectModal);
        }
        
        // Create project modal overlay (click to close)
        if (createProjectModalOverlay) {
            createProjectModalOverlay.addEventListener('click', closeCreateProjectModal);
        }
        
        // Cancel create project button
        if (cancelProjectButton) {
            cancelProjectButton.addEventListener('click', closeCreateProjectModal);
        }
        
        // Save project button
        if (saveProjectBtn) {
            saveProjectBtn.addEventListener('click', createNewProject);
        }
        
        // Handle form submission via Enter key
        if (newProjectForm) {
            newProjectForm.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    createNewProject();
                }
            });
        }
    }

    // Initialize the page
    function initialize() {
        vendorData = loadVendorData();
        if (vendorData) {
            // Continue with initialization
            updateVendorStatusUI();
            renderDocumentList();
            renderProjectsList();
            updateFeatureAvailability();
            setupEventListeners();
        }
    }
    
    // Start the initialization
    initialize();
});