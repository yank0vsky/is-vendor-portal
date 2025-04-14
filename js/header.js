// Header navigation logic for Vendor and Admin flows
// This script should be included on all prototype pages

/**
 * Handles navigation for Vendor and Admin flows from the header.
 * Ensures required localStorage data is present before redirecting.
 */
document.addEventListener('DOMContentLoaded', function () {
    const vendorBtn = document.getElementById('header-vendor-btn');
    const adminBtn = document.getElementById('header-admin-btn');

    // Vendor Flow
    if (vendorBtn) {
        vendorBtn.addEventListener('click', function () {
            const vendorData = localStorage.getItem('inventStoreVendorData');
            if (vendorData) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'register.html';
            }
        });
    }

    // Admin Flow
    if (adminBtn) {
        adminBtn.addEventListener('click', function () {
            const adminKey = 'inventStoreAdminData';
            let adminData = localStorage.getItem(adminKey);
            if (!adminData) {
                // Create default admin data if not present
                const defaultAdmin = {
                    username: 'admin',
                    role: 'admin',
                    permissions: ['view', 'edit', 'delete'],
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem(adminKey, JSON.stringify(defaultAdmin));
            }
            window.location.href = 'admin-dashboard.html';
        });
    }
}); 