/**
 * Handles the submission of the registration form.
 * Saves vendor data to local storage and redirects to the confirmation page.
 */
function handleRegistrationSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // --- Get form elements ---
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const companyInput = document.getElementById('company');
    const emailInput = document.getElementById('email');
    const roleInput = document.getElementById('role');
    const companySizeSelect = document.getElementById('company-size');

    // --- Basic Validation (Check if fields are filled) ---
    // HTML5 'required' attribute handles most basic cases,
    // but extra JS validation can be added here if needed.
    if (!firstNameInput.value || !lastNameInput.value || !companyInput.value || !emailInput.value || !roleInput.value || !companySizeSelect.value) {
        alert('Please fill in all required fields.');
        return; // Stop execution if validation fails
    }

    // --- Prepare data for local storage ---
    const vendorData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        company: companyInput.value.trim(),
        email: emailInput.value.trim(), // Make sure this is captured correctly
        role: roleInput.value.trim(),
        companySize: companySizeSelect.value,
        documents: { // Initialize document status
            terms: false,
            agreement: false,
            mnda: false
        },
        projects: [] // Initialize empty projects array
    };

    // --- Save to Local Storage ---
    try {
        // Use a consistent key for storage
        const storageKey = 'inventStoreVendorData';
        localStorage.setItem(storageKey, JSON.stringify(vendorData));
        console.log('Vendor data saved to local storage:', vendorData);

        // --- Redirect to Confirmation Page instead of Dashboard ---
        window.location.href = 'confirmation.html';

    } catch (error) {
        console.error('Error saving data to local storage:', error);
        // Inform user if storage fails (e.g., storage full or disabled)
        alert('Could not save registration data. Please ensure local storage is enabled and not full.');
    }
}

// --- Attach Event Listener ---
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistrationSubmit);
} else {
    console.error('Registration form not found!');
}