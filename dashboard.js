/**
 * Opens the Create Project modal
 */
function openCreateProjectModal() {
    if (!createProjectModalContainer) {
        console.error('Create project modal container not found');
        return;
    }
    
    // Clear form fields
    if (newProjectForm) {
        newProjectForm.reset();
    }
    
    // Show modal
    createProjectModalContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Focus on the project name input
    if (projectNameInput) {
        setTimeout(() => {
            projectNameInput.focus();
        }, 100); // Small delay to ensure the modal is visible
    }
}

/**
 * Closes the Create Project modal
 */
function closeCreateProjectModal() {
    if (!createProjectModalContainer) {
        console.error('Create project modal container not found');
        return;
    }
    
    createProjectModalContainer.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
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
    } else {
        console.error('Create project button not found');
    }
    
    // Create project modal close button
    if (createProjectCloseBtn) {
        createProjectCloseBtn.addEventListener('click', closeCreateProjectModal);
    } else {
        console.error('Create project close button not found');
    }
    
    // Create project modal overlay (click to close)
    if (createProjectModalOverlay) {
        createProjectModalOverlay.addEventListener('click', closeCreateProjectModal);
    } else {
        console.error('Create project modal overlay not found');
    }
    
    // Cancel create project button
    if (cancelProjectButton) {
        cancelProjectButton.addEventListener('click', closeCreateProjectModal);
    } else {
        console.error('Cancel create project button not found');
    }
    
    // Save project button
    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', createNewProject);
    } else {
        console.error('Save project button not found');
    }
    
    // Handle form submission via Enter key
    if (newProjectForm) {
        newProjectForm.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                createNewProject();
            }
        });
    } else {
        console.error('New project form not found');
    }
} 