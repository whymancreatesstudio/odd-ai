// Company Management Service
// Handles saving, retrieving, and managing company data locally

class CompanyManager {
    constructor() {
        this.storageKey = 'oddtool_companies';
        this.companies = this.loadCompanies();
    }

    // Load all companies from localStorage
    loadCompanies() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading companies:', error);
            return {};
        }
    }

    // Save all companies to localStorage
    saveCompanies() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.companies));
        } catch (error) {
            console.error('Error saving companies:', error);
        }
    }

    // Add or update a company
    saveCompany(companyName, companyData, crmData = null, auditData = null) {
        const company = {
            id: this.generateId(),
            companyName,
            companyData,
            crmData,
            auditData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.companies[companyName] = company;
        this.saveCompanies();
        return company;
    }

    // Update CRM data for a company
    updateCRMData(companyName, crmData) {
        if (this.companies[companyName]) {
            this.companies[companyName].crmData = crmData;
            this.companies[companyName].updatedAt = new Date().toISOString();
            this.saveCompanies();
        }
    }

    // Update audit data for a company
    updateAuditData(companyName, auditData) {
        if (this.companies[companyName]) {
            this.companies[companyName].auditData = auditData;
            this.companies[companyName].updatedAt = new Date().toISOString();
            this.saveCompanies();
        }
    }

    // Get all companies
    getAllCompanies() {
        return Object.values(this.companies);
    }

    // Get a specific company
    getCompany(companyName) {
        return this.companies[companyName] || null;
    }

    // Delete a company
    deleteCompany(companyName) {
        if (this.companies[companyName]) {
            delete this.companies[companyName];
            this.saveCompanies();
            return true;
        }
        return false;
    }

    // Check if company exists
    companyExists(companyName) {
        return !!this.companies[companyName];
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get companies sorted by last updated
    getCompaniesSorted() {
        return this.getAllCompanies().sort((a, b) => 
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }

    // Export all data (for backup)
    exportData() {
        return JSON.stringify(this.companies, null, 2);
    }

    // Import data (for restore)
    importData(data) {
        try {
            const parsed = JSON.parse(data);
            this.companies = parsed;
            this.saveCompanies();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

export default new CompanyManager(); 