/**
 * Project Detail Page JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'inventStoreVendorData';
    let vendorData = null;
    let currentProject = null;
    let projectId = null;

    // --- Element References ---
    const projectNameHeading = document.getElementById('project-name-heading');
    const projectDescriptionEl = document.getElementById('project-description');
    const projectInfoDisplay = document.getElementById('project-info-display');
    const projectInfoForm = document.getElementById('project-info-form');
    const editProjectInfoBtn = document.getElementById('edit-project-info-btn');
    const cancelEditProjectInfoBtn = document.getElementById('cancel-edit-project-info-btn');
    const saveProjectInfoBtn = document.getElementById('save-project-info-btn');
    const editProjectNameInput = document.getElementById('edit-project-name');
    const editProjectDescriptionInput = document.getElementById('edit-project-description');
    
    const teamListContainer = document.getElementById('team-list-container'); // Container for table/message
    const inviteForm = document.getElementById('invite-member-form');
    const inviteFirstNameInput = document.getElementById('invite-first-name');
    const inviteLastNameInput = document.getElementById('invite-last-name');
    const inviteEmailInput = document.getElementById('invite-email');
    const inviteRoleSelect = document.getElementById('invite-role');
    const notificationArea = document.getElementById('notification-area');

    // Collapsible Section Elements
    const teamSectionHeading = document.getElementById('team-section-heading');
    const teamContentWrapper = document.getElementById('team-content-wrapper');

    // Modal Elements
    const modalBackdrop = document.getElementById('modal-backdrop');
    const editModal = document.getElementById('edit-member-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalCancelButton = document.getElementById('modal-cancel-button');
    const modalSaveButton = document.getElementById('modal-save-button');
    const modalMemberName = document.getElementById('modal-member-name');
    const modalMemberEmail = document.getElementById('modal-member-email');
    const modalRoleOptions = document.getElementById('modal-role-options'); // Container for radios

    // Additional Element References
    const actionDevelopBtn = document.getElementById('action-develop');
    const actionMarketingBtn = document.getElementById('action-marketing');
    const actionStatisticsBtn = document.getElementById('action-statistics');

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
        
        // Render UI and set up event listeners
        renderProjectInfo();
        renderTeamList();
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
     * Saves the current vendorData object back to local storage.
     * @returns {boolean} True if save was successful, false otherwise.
     */
     function saveVendorData() {
        if (!vendorData) {
             console.error("Attempted to save null vendor data.");
             return false;
        }
        try {
            localStorage.setItem(storageKey, JSON.stringify(vendorData));
            console.log('Vendor data updated and saved.');
            return true;
        } catch (error) {
            console.error('Error saving updated vendor data:', error);
            alert('Could not save changes to local storage. Your data might be out of sync.');
            return false;
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
            projectNameHeading.textContent = currentProject.name || 'Project Details';
            projectDescriptionEl.textContent = currentProject.description || 'No description provided.';
        } else if (projectNameHeading) {
            // Handle case where project exists but elements don't (should not happen with correct HTML)
            projectNameHeading.textContent = 'Project Not Found';
             if(projectDescriptionEl) projectDescriptionEl.textContent = 'Could not load project details.';
        }
    }

    /**
     * Renders the list of team members in the table, including the Actions menu.
     */
     function renderTeamList() {
        // --- Remove the loading message first ---
        const loadingMessage = document.getElementById('loading-members-message');
        if (loadingMessage) loadingMessage.remove();
        // --- Proceed with rendering ---
        let currentTeamListBody = document.getElementById('team-members-list'); // Get tbody ref
        

        if (!currentProject || !currentProject.members || !teamListContainer) {
            if(teamListContainer) teamListContainer.innerHTML = '<p class="error-message">Could not load team members.</p>';
            console.error("Cannot render team list: project/members data or container element missing.");
            return;
        }

        // Check if the table needs to be recreated or just cleared
        let table = teamListContainer.querySelector('.team-table');
        if (currentProject.members.length === 0) {
             teamListContainer.innerHTML = '<p class="no-members">No team members have been added yet.</p>';
             if (table) table.remove(); // Remove table if no members
            return;
        } else if (!table) {
            // Recreate table if it doesn't exist (e.g., was replaced by 'no members')
            teamListContainer.innerHTML = ''; // Clear 'no members' message
            table = document.createElement('table');
            table.className = 'team-table';
            table.innerHTML = `<thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>`;
            const newTbody = document.createElement('tbody');
            newTbody.id = 'team-members-list';
            table.appendChild(newTbody);
            teamListContainer.appendChild(table);
            currentTeamListBody = newTbody; // Update reference to the new tbody
        } else {
             // Table exists, ensure we have tbody ref and clear it
             currentTeamListBody = table.querySelector('tbody');
             if (!currentTeamListBody) {
                  console.error("Cannot find tbody in existing table.");
                  return; // Cannot proceed without tbody
             }
             currentTeamListBody.innerHTML = '';
        }

        // Get primary manager email for comparison
        const primaryManagerEmail = vendorData?.email;

        // Loop through ALL members and render rows
        currentProject.members.forEach(member => {
             // Ensure currentTeamListBody is valid before inserting rows
             if (!currentTeamListBody) {
                 console.error("tbody element became invalid during rendering loop.");
                 return;
             }
            const row = currentTeamListBody.insertRow();

            // Name cell
            row.insertCell().textContent = member.name || 'N/A';

            // Email cell
             row.insertCell().textContent = member.email || 'N/A';

            // Role cell
            const roleCell = row.insertCell();
            const roleTag = document.createElement('span');
            const roleClass = member.role ? member.role.toLowerCase() : 'unknown';
            roleTag.className = `role-tag ${roleClass}`;
            roleTag.textContent = member.role || 'Unknown';
            roleCell.appendChild(roleTag);

            // Status cell
            const statusCell = row.insertCell();
            const statusTag = document.createElement('span');
            statusTag.className = 'status-tag';
            const currentStatus = member.status || 'Active'; // Default to Active if status missing
            statusTag.textContent = currentStatus;
            statusTag.classList.add(currentStatus.toLowerCase().replace(' ', '-')); // 'active', 'invite-sent'
            statusCell.appendChild(statusTag);

            // Actions cell
            const actionsCell = row.insertCell();
            actionsCell.className = 'actions-cell';
            actionsCell.style.position = 'relative'; // For dropdown positioning

            // Only show actions for members with email who are not the primary manager
            if (member.email && member.email !== primaryManagerEmail) {
                // Create Actions Button (...)
                const actionButton = document.createElement('button');
                actionButton.className = 'actions-button';
                actionButton.innerHTML = '⋮'; // Vertical ellipsis
                actionButton.setAttribute('aria-label', `Actions for ${member.name || member.email}`);
                actionButton.setAttribute('aria-haspopup', 'true');
                actionButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent global listener from closing it immediately
                    toggleActionsMenu(event.currentTarget);
                });
                actionsCell.appendChild(actionButton);

                // Create Actions Menu (hidden by default)
                const menu = document.createElement('div');
                menu.className = 'actions-menu';
                menu.setAttribute('role', 'menu');

                // Edit Action
                const editButton = document.createElement('button');
                editButton.innerHTML = '<i class="fas fa-edit"></i> Edit Member';
                editButton.setAttribute('role', 'menuitem');
                editButton.dataset.email = member.email; // Store email on button
                editButton.addEventListener('click', () => {
                     if (member.email) {
                         openEditModal(member.email);
                     }
                     closeAllActionMenus(); // Close menu after action selected
                });
                menu.appendChild(editButton);

                // Revoke Action
                const revokeButton = document.createElement('button');
                revokeButton.innerHTML = '<i class="fas fa-trash-alt"></i> Revoke Access';
                revokeButton.className = 'revoke-action'; // Style specifically
                revokeButton.setAttribute('role', 'menuitem');
                revokeButton.dataset.email = member.email; // Store email on button
                revokeButton.addEventListener('click', () => {
                    if (member.email) {
                        handleRevokeMember(member.email);
                    }
                    closeAllActionMenus(); // Close menu after action selected
                });
                menu.appendChild(revokeButton);

                actionsCell.appendChild(menu); // Add menu to cell

            } else {
                actionsCell.textContent = '-'; // No actions for primary manager or members without email
            }
        });
     }

    /**
     * Toggles the visibility of a specific actions menu.
     * Closes other open menus.
     * @param {HTMLElement} buttonElement - The button (...) that was clicked.
     */
     function toggleActionsMenu(buttonElement) {
         const menu = buttonElement.nextElementSibling; // Assumes menu is the immediate next sibling
         if (!menu || !menu.classList.contains('actions-menu')) {
             console.error("Could not find actions menu for button:", buttonElement);
             return;
         }

         const isCurrentlyActive = menu.classList.contains('active');

         // Close all other menus first before potentially opening a new one
         closeAllActionMenus(menu); // Pass the current menu to potentially skip closing it

         // Toggle the current menu's state *after* closing others
         if (!isCurrentlyActive) {
             menu.classList.add('active');
             // Add a one-time listener to the document to catch clicks outside
             // Use setTimeout to ensure this listener is added after the current click event bubble phase
             setTimeout(() => {
                 document.addEventListener('click', handleOutsideClick, { capture: true, once: true });
             }, 0);
         }
         // If it was already active, closeAllActionMenus would have just closed it.
     }

     /** Close all open action menus, optionally skipping one menu element */
     function closeAllActionMenus(skipMenu = null) {
         document.querySelectorAll('.actions-menu.active').forEach(openMenu => {
             if (openMenu !== skipMenu) {
                 openMenu.classList.remove('active');
             }
         });
     }

     /** Handle clicks outside of an open actions menu to close it */
     function handleOutsideClick(event) {
          // Check if the click target is inside *any* actions menu or on *any* actions button
         const clickedInsideMenu = event.target.closest('.actions-menu');
         const clickedOnButton = event.target.closest('.actions-button');

         // If the click originated inside a menu or on its toggle button, do nothing here.
         // Let the menu item handlers or the toggle handler manage the state.
         if (clickedInsideMenu || clickedOnButton) {
             return;
         }

         // Otherwise, the click was outside; close all menus.
         closeAllActionMenus();
         // The listener is automatically removed because of 'once: true'
     }


    /**
     * Toggles the visibility of the team content section.
     */
    function toggleTeamSection() {
        if (!teamSectionHeading || !teamContentWrapper) {
            console.warn("Missing elements for team section toggle.");
            return;
        }
        const isExpanded = teamSectionHeading.getAttribute('aria-expanded') === 'true';
        teamSectionHeading.setAttribute('aria-expanded', String(!isExpanded));
        // CSS handles visibility based on the attribute
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
     * Handles the form submission for inviting a new member.
     */
     function handleInviteMember(event) {
        event.preventDefault();
        if (!currentProject || !vendorData || !inviteFirstNameInput || !inviteLastNameInput || !inviteEmailInput || !inviteRoleSelect) {
             console.error("Invite form elements missing or data not loaded.");
             showNotification("Error: Could not process invitation.", "error");
             return;
        }

        const firstName = inviteFirstNameInput.value.trim();
        const lastName = inviteLastNameInput.value.trim();
        const email = inviteEmailInput.value.trim().toLowerCase();
        const role = inviteRoleSelect.value;

        if (!firstName || !lastName || !email) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
             showNotification('Please enter a valid email address.', 'error');
             inviteEmailInput.focus();
             return;
        }
        if (currentProject.members.some(member => member.email === email)) {
             showNotification(`${email} is already a member or has a pending invite.`, 'error');
            return;
        }

        // Combine first and last name for the member object
        const fullName = `${firstName} ${lastName}`.trim();

        const newMember = {
            name: fullName,
            email: email,
            role: role,
            status: 'Invite Sent' // Set status for new invite
        };

        if (!Array.isArray(currentProject.members)) { // Ensure members array exists
             currentProject.members = [];
        }
        currentProject.members.push(newMember);

        if (saveVendorData()) {
            console.log('Member invite sent:', newMember);
            renderTeamList(); // Update table
            showNotification(`Invitation sent successfully to ${email}.`, 'success');
            // Clear form
            inviteFirstNameInput.value = '';
            inviteLastNameInput.value = '';
            inviteEmailInput.value = '';
            inviteRoleSelect.value = 'member'; // Reset back to default value
        } else {
            // Revert if save failed
            currentProject.members.pop();
            showNotification('Failed to send invitation. Please try again.', 'error');
        }
    }

     /**
     * Handles removing a member from the project (triggered by menu action).
     * @param {string} memberEmail - The email of the member to revoke.
     */
     function handleRevokeMember(memberEmail) {
        if (!currentProject || !vendorData || !memberEmail) {
             console.error("Cannot revoke: Missing project data or member email.");
             return;
        }

        const memberIndex = currentProject.members.findIndex(member => member.email === memberEmail);
        if (memberIndex === -1) {
            console.warn(`Member with email ${memberEmail} not found for revocation.`);
            showNotification(`Error: Member ${memberEmail} not found.`, 'error');
            return;
        }

        // Prevent revoking the primary manager
        if (memberEmail === vendorData.email) {
             showNotification("You cannot revoke the primary manager.", 'error');
             return;
        }

        const memberName = currentProject.members[memberIndex].name || memberEmail;
        // Confirmation dialog
        if (!confirm(`Are you sure you want to revoke access for ${memberName}? This action cannot be undone.`)) {
            return; // User cancelled
        }

        // Remove the member from the array
        currentProject.members.splice(memberIndex, 1);

        // Save updated data and re-render
        if (saveVendorData()) {
            console.log(`Member revoked: ${memberEmail}`);
            renderTeamList(); // Update UI
            showNotification(`Access revoked for ${memberName}.`, 'success');
        } else {
            // Reverting splice is complex in this prototype structure upon save failure.
            // Alert user and recommend refresh.
             showNotification('Failed to save revocation. The user might still appear until you refresh.', 'error');
        }
    }


    /** --- Modal Functions --- */

    /** Opens the Edit Member Modal and populates it with member data */
    function openEditModal(memberEmail) {
        if (!currentProject || !editModal || !modalBackdrop || !modalMemberName || !modalMemberEmail || !modalRoleOptions) {
             console.error("Cannot open edit modal: Missing elements or project data.");
             return;
        }

        const member = currentProject.members.find(m => m.email === memberEmail);
        if (!member) {
            showNotification("Could not find member data to edit.", "error");
            console.warn(`Member not found for email: ${memberEmail}`);
            return;
        }

        // Populate modal static fields
        modalMemberName.textContent = member.name || 'N/A';
        modalMemberEmail.textContent = member.email;

        // Set current role selection in radio buttons
        const roleRadios = modalRoleOptions.querySelectorAll('input[name="modal-role"]');
        let foundRadio = false;
        roleRadios.forEach(radio => {
            radio.checked = (radio.value === member.role);
            if (radio.checked) foundRadio = true;
        });
        // Fallback if role doesn't match any radio value (shouldn't happen with 'admin'/'developer')
        if (!foundRadio && roleRadios.length > 0) {
             roleRadios[0].checked = true; // Default to first option maybe? Or log error.
             console.warn(`Member role "${member.role}" did not match any radio button value.`);
        }

        // Store the email of the member being edited on the modal's dataset for later retrieval
        editModal.dataset.editingEmail = memberEmail;

        // Show modal and backdrop using CSS classes
        editModal.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');
        editModal.setAttribute('aria-hidden', 'false'); // Accessibility
    }

    /** Closes the Edit Member Modal and cleans up */
    function closeEditModal() {
        if (editModal && modalBackdrop) {
            editModal.classList.add('hidden');
            modalBackdrop.classList.add('hidden');
            editModal.setAttribute('aria-hidden', 'true'); // Accessibility

            // Clear sensitive/dynamic data from modal
            delete editModal.dataset.editingEmail;
            if(modalMemberName) modalMemberName.textContent = '';
            if(modalMemberEmail) modalMemberEmail.textContent = '';

            // Reset radio buttons to default state (optional, good practice)
            const roleRadios = modalRoleOptions ? modalRoleOptions.querySelectorAll('input[name="modal-role"]') : [];
             roleRadios.forEach(radio => radio.checked = false);
        }
    }

    /** Handles saving changes from the Edit Member modal */
    function handleSaveChanges() {
        if (!currentProject || !editModal || !modalRoleOptions) {
            console.error("Cannot save: Missing modal elements or project data.");
            return;
        }

        const memberEmail = editModal.dataset.editingEmail; // Retrieve email stored earlier
        if (!memberEmail) {
            console.error("Could not determine which member is being edited from modal data.");
            showNotification("Error saving changes: Member context lost.", "error");
            return;
        }

        // Find the selected role from radio buttons
        const selectedRoleRadio = modalRoleOptions.querySelector('input[name="modal-role"]:checked');
        if (!selectedRoleRadio) {
            showNotification("Error: No role selected.", "error");
            return;
        }
        const newRole = selectedRoleRadio.value;

        // Find the member object in our project data
        const memberIndex = currentProject.members.findIndex(m => m.email === memberEmail);
        if (memberIndex === -1) {
             showNotification("Error saving changes: Member data could not be found.", "error");
             console.error(`Member with email ${memberEmail} not found in project data during save.`);
             return;
        }
        const member = currentProject.members[memberIndex];

        // --- Update the member's role in the project data ---
        member.role = newRole;

        // Optional: Update status if needed (e.g., change 'Invite Sent' to 'Active' on first edit)
        // if (member.status === 'Invite Sent') {
        //     member.status = 'Active';
        //     console.log(`Status updated to Active for ${memberEmail}`);
        // }
        // ---

        // Attempt to save the updated vendor data (which includes the project)
        if (saveVendorData()) {
            renderTeamList(); // Re-render the table with updated role
            closeEditModal(); // Close the modal window
            showNotification(`Role updated successfully for ${member.name || member.email}.`, 'success');
        } else {
            // If save failed, we should ideally revert the change in memory
            // For simplicity in prototype, just show error. User might need to retry/refresh.
            // To revert: Need to store the original role before changing `member.role = newRole;`
            showNotification("Failed to save role change. Please try again.", "error");
        }
    }

    /** --- Project Info Editing Functions --- */

    /** Toggles between displaying project info and showing the edit form */
    function toggleProjectInfoEdit(showForm) {
        if (!projectInfoDisplay || !projectInfoForm || !editProjectNameInput || !editProjectDescriptionInput) {
            console.error("Missing elements required for project info edit toggle.");
            return;
        }
        
        if (showForm) {
            // Populate form with current data
            editProjectNameInput.value = currentProject.name || '';
            editProjectDescriptionInput.value = currentProject.description || '';
            
            // Show form, hide display
            projectInfoDisplay.classList.add('hidden');
            projectInfoForm.classList.remove('hidden');
            editProjectNameInput.focus();
        } else {
            // Show display, hide form
            projectInfoDisplay.classList.remove('hidden');
            projectInfoForm.classList.add('hidden');
        }
    }

    /** Handles saving the edited project information */
    function handleSaveProjectInfo() {
        if (!currentProject || !editProjectNameInput || !editProjectDescriptionInput) {
             console.error("Cannot save project info: Missing data or form elements.");
             return;
        }

        const newName = editProjectNameInput.value.trim();
        const newDescription = editProjectDescriptionInput.value.trim();

        if (!newName) {
            showNotification("Project name cannot be empty.", "error");
            editProjectNameInput.focus();
            return;
        }

        // Update the project data in memory
        currentProject.name = newName;
        currentProject.description = newDescription;

        // Attempt to save the updated vendor data
        if (saveVendorData()) {
            renderProjectInfo(); // Re-render the display
            toggleProjectInfoEdit(false); // Hide the form
            showNotification("Project information updated successfully.", "success");
        } else {
             // Optionally revert changes in memory if save fails
             // For now, just show error
             showNotification("Failed to save project information.", "error");
        }
    }


    /**
     * Set up event listeners for all interactive elements on the page
     */
    function setupEventListeners() {
        // --- Project Info Edit Listeners ---
        if (editProjectInfoBtn) {
            editProjectInfoBtn.addEventListener('click', () => toggleProjectInfoEdit(true));
        }
        if (cancelEditProjectInfoBtn) {
            cancelEditProjectInfoBtn.addEventListener('click', () => toggleProjectInfoEdit(false));
        }
        if (saveProjectInfoBtn) {
            saveProjectInfoBtn.addEventListener('click', handleSaveProjectInfo);
        }
        
        // Prevent Enter key submission in description textarea causing save
        if (editProjectDescriptionInput) {
             editProjectDescriptionInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault(); // Prevent default newline
                    handleSaveProjectInfo(); // Submit on Enter without Shift
                }
            });
        }
        // Allow form submission via Enter on name input
        if (editProjectNameInput) {
             editProjectNameInput.addEventListener('keydown', (event) => {
                 if (event.key === 'Enter') {
                     event.preventDefault();
                     handleSaveProjectInfo();
                 }
             });
        }
        // --- End Project Info Edit Listeners ---
        
        // Team section collapsible
        if (teamSectionHeading) {
            teamSectionHeading.addEventListener('click', toggleTeamSection);
            // Set initial collapsed state via attribute, CSS handles visibility
            teamSectionHeading.setAttribute('aria-expanded', 'false');
        }

        // Invite form submission
        if (inviteForm) {
            inviteForm.addEventListener('submit', handleInviteMember);
        }

        // Modal close button
        if (modalCloseButton) {
            modalCloseButton.addEventListener('click', closeEditModal);
        }

        // Modal cancel button
        if (modalCancelButton) {
            modalCancelButton.addEventListener('click', closeEditModal);
        }

        // Modal save button
        if (modalSaveButton) {
            modalSaveButton.addEventListener('click', handleSaveChanges);
        }

        // Modal backdrop click (close)
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeEditModal);
        }

        // App Development button
        if (actionDevelopBtn) {
            actionDevelopBtn.addEventListener('click', () => {
                window.location.href = `developerPortal.html?id=${projectId}`;
            });
        }

        // Marketing Listing button
        if (actionMarketingBtn) {
            actionMarketingBtn.addEventListener('click', () => {
                window.location.href = `marketingListing.html?id=${projectId}`;
            });
        }

        // Statistics button
        if (actionStatisticsBtn) {
            actionStatisticsBtn.addEventListener('click', () => {
                window.location.href = `project-statistics.html?id=${projectId}`;
            });
        }

        // Close actions menu when clicking outside
        document.addEventListener('click', handleOutsideClick);
    }
}); // End DOMContentLoaded