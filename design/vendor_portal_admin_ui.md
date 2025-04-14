# Vendor Portal Admin UI Design
## Overview
Create an admin interface prototype for the Invent Store Vendor Portal that allows admin users to manage vendor documents through a clean, intuitive interface.

## Features
1. **Vendor Document Management Tab**
   - View and manage default document sets for new vendors
   - View and manage documents for specific registered vendors
   - Track document history and signing status

2. **Default Document Set**
   - Upload documents that will be automatically provided to all new vendors
   - View current default documents
   - Replace/update default documents

3. **Vendor-Specific Document Management**
   - View documents for each registered vendor
   - Replace/update specific documents for individual vendors
   - View document signing history with timestamps, user information

## Data Model

```javascript
// Admin data model
{
  defaultDocuments: [
    {
      id: "uniqueId1",
      name: "Terms and Conditions",
      fileName: "terms.pdf",
      dateAdded: "2023-06-01T12:00:00Z",
      addedBy: "admin@invent.us"
    },
    // Other default documents
  ],
  
  vendorDocuments: {
    "vendorId1": {
      documents: [
        {
          id: "docId1",
          name: "Terms and Conditions",
          fileName: "terms.pdf",
          dateAdded: "2023-06-01T12:00:00Z",
          history: [
            {
              action: "added", // added, updated, signed
              date: "2023-06-01T12:00:00Z",
              by: "admin@invent.us"
            },
            {
              action: "signed",
              date: "2023-06-10T15:30:00Z",
              by: "vendor@company.com" 
            }
          ]
        }
        // Other vendor-specific documents
      ]
    }
    // Other vendors
  }
}
```

## UI Components

### 1. Admin Dashboard
- Navigation sidebar with "Vendor Document Management" tab
- Overview statistics panel (total vendors, pending documents, etc.)

### 2. Vendor Document Management
- Default Document Set section
  - Document upload interface
  - Current default document list
  - Document preview/download functionality
  
- Vendor Document Management section
  - Vendor search/filter functionality
  - Vendor list with document status indicators
  - Detailed view for individual vendor documents
  - Document history timeline

## Implementation Plan

### Phase 1: Admin UI Structure
- Create basic admin dashboard structure
- Implement navigation and layout
- Create mock data structure

### Phase 2: Default Document Management
- Implement default document upload functionality
- Create default document list view
- Add document preview/download capabilities

### Phase 3: Vendor Document Management
- Implement vendor search/filter functionality
- Create vendor document detail view
- Implement document history timeline

### Phase 4: Integration
- Connect admin UI to vendor portal data (simulated for prototype)
- Implement document assignment to vendors

## Page Structure

### admin-dashboard.html
Main admin dashboard with navigation and overview statistics

### vendor-document-management.html
Main interface for managing vendor documents:
- Default document set management
- Vendor-specific document management

## Technical Considerations
- Use the same styling patterns as the vendor portal
- Maintain similar data structure for compatibility
- For the prototype, use localStorage to simulate database
- Implement mock user authentication for admin access 