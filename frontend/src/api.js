// API integration for Google Custom Search and CRM operations
const API_BASE_URL = 'http://localhost:5001/api';

class CRMAPI {
    // Health check
    static async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    // General search
    static async search(query, companyName, searchType = null) {
        try {
            const response = await fetch(`${API_BASE_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    companyName,
                    searchType
                })
            });

            if (!response.ok) {
                throw new Error(`Search failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Search API error:', error);
            throw error;
        }
    }

    // Comprehensive company search
    static async searchCompany(companyName) {
        try {
            const response = await fetch(`${API_BASE_URL}/search/company`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyName })
            });

            if (!response.ok) {
                throw new Error(`Company search failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Company search API error:', error);
            throw error;
        }
    }

    // Save search results
    static async saveSearchResults(companyData, searchResults) {
        try {
            const response = await fetch(`${API_BASE_URL}/save-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyData,
                    searchResults
                })
            });

            if (!response.ok) {
                throw new Error(`Save failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Save API error:', error);
            throw error;
        }
    }

    // Get search history
    static async getSearchHistory(companyName) {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history/${encodeURIComponent(companyName)}`);

            if (!response.ok) {
                throw new Error(`History fetch failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('History API error:', error);
            throw error;
        }
    }

    // Update company CRM
    static async updateCRM(companyName, crmData) {
        try {
            const response = await fetch(`${API_BASE_URL}/update-crm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyName,
                    crmData
                })
            });

            if (!response.ok) {
                throw new Error(`CRM update failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('CRM update API error:', error);
            throw error;
        }
    }

    // NEW: Website meta tag fetcher
    static async fetchWebsiteInfo(website) {
        try {
            const response = await fetch(`${API_BASE_URL}/fetch-website-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ website })
            });

            if (!response.ok) {
                // Handle specific status codes with user-friendly messages
                if (response.status === 403) {
                    throw new Error('Website is blocking automated requests. This is common for some websites. Continuing with company name search only.');
                } else if (response.status === 404) {
                    throw new Error('Website not found. Please check the URL and try again.');
                } else if (response.status >= 500) {
                    throw new Error('Website server error. Please try again later.');
                } else {
                    throw new Error(`Website info fetch failed: ${response.statusText}`);
                }
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // NEW: Enhanced company search (with website)
    static async searchCompanyEnhanced(companyName, website) {
        try {
            const response = await fetch(`${API_BASE_URL}/search/company/enhanced`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyName, website })
            });

            if (!response.ok) {
                throw new Error(`Enhanced company search failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // NEW: Save final results (only when user confirms)
    static async saveFinalResults(companyData, aiInsights, searchResults, officialCompanyName, userNotes) {
        try {
            const response = await fetch(`${API_BASE_URL}/save-final-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyData,
                    aiInsights,
                    searchResults,
                    officialCompanyName,
                    userNotes
                })
            });

            if (!response.ok) {
                throw new Error(`Save final results failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // NEW: Save audit to database
    static async saveAudit(companyData, crmData, audit, auditStatus) {
        try {
            const response = await fetch(`${API_BASE_URL}/save-audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyData,
                    crmData,
                    audit,
                    auditStatus
                })
            });

            if (!response.ok) {
                throw new Error(`Save audit failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Legacy: Specific search methods for convenience
    static async searchFunding(companyName) {
        return this.search(null, companyName, 'funding');
    }

    static async searchNews(companyName) {
        return this.search(null, companyName, 'news');
    }

    static async searchJobs(companyName) {
        return this.search(null, companyName, 'jobs');
    }

    static async searchPeople(companyName) {
        return this.search(null, companyName, 'people');
    }

    static async searchCompanyProfile(companyName) {
        return this.search(null, companyName, 'company');
    }
}

export default CRMAPI; 