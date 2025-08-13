const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

const googleSearch = require('./googleSearch');
const supabase = require('./supabase');
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CRM Search API is running' });
});

// Google Search endpoint
app.post('/api/search', async (req, res) => {
    try {
        const { query, companyName, searchType } = req.body;

        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        let results;
        if (searchType === 'funding') {
            results = await googleSearch.searchFunding(companyName);
        } else if (searchType === 'news') {
            results = await googleSearch.searchNews(companyName);
        } else if (searchType === 'jobs') {
            results = await googleSearch.searchJobs(companyName);
        } else if (searchType === 'people') {
            results = await googleSearch.searchPeople(companyName);
        } else if (searchType === 'company') {
            results = await googleSearch.searchCompany(companyName);
        } else {
            results = await googleSearch.search(query || 'company information', companyName);
        }

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// NEW: Website Meta Tag Fetcher
app.post('/api/fetch-website-info', async (req, res) => {
    try {
        const { website } = req.body;

        if (!website) {
            return res.status(400).json({ error: 'Website URL is required' });
        }

        // Validate website URL
        try {
            new URL(website);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid website URL' });
        }

        const websiteInfo = await googleSearch.fetchWebsiteMetaTags(website);
        res.json(websiteInfo);
    } catch (error) {
        console.error('Website info fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Enhanced comprehensive company search (with website)
app.post('/api/search/company/enhanced', async (req, res) => {
    try {
        const { companyName, website } = req.body;

        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        // Use enhanced search with both company name and website
        const enhancedResults = await googleSearch.searchCompanyEnhanced(companyName, website);
        res.json(enhancedResults);
    } catch (error) {
        console.error('Enhanced company search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Legacy comprehensive company search (for backward compatibility)
app.post('/api/search/company', async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        // Perform multiple searches in parallel
        const [funding, news, jobs, people, company] = await Promise.all([
            googleSearch.searchFunding(companyName),
            googleSearch.searchNews(companyName),
            googleSearch.searchJobs(companyName),
            googleSearch.searchPeople(companyName),
            googleSearch.searchCompany(companyName)
        ]);

        const comprehensiveResults = {
            companyName,
            funding,
            news,
            jobs,
            people,
            company,
            searchDate: new Date().toISOString()
        };

        res.json(comprehensiveResults);
    } catch (error) {
        console.error('Comprehensive search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save search results
app.post('/api/save-results', async (req, res) => {
    try {
        const { companyData, searchResults } = req.body;

        if (!companyData || !searchResults) {
            return res.status(400).json({ error: 'Company data and search results are required' });
        }

        const saved = await supabase.saveSearchResults(companyData, searchResults);
        res.json(saved);
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get search history
app.get('/api/search-history/:companyName', async (req, res) => {
    try {
        const { companyName } = req.params;
        const history = await supabase.getSearchHistory(companyName);
        res.json(history);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: error.message });
    }
});

// NEW: Save final results (only when user confirms)
app.post('/api/save-final-results', async (req, res) => {
    try {
        const {
            companyData,
            aiInsights,
            searchResults,
            officialCompanyName,
            userNotes
        } = req.body;

        if (!companyData || !aiInsights || !searchResults) {
            return res.status(400).json({
                error: 'Company data, AI insights, and search results are required'
            });
        }

        // Save to both tables
        const savedResults = await supabase.saveFinalResults(
            companyData,
            aiInsights,
            searchResults,
            officialCompanyName,
            userNotes
        );

        res.json({
            success: true,
            message: 'CRM results saved successfully',
            data: savedResults
        });
    } catch (error) {
        console.error('Save final results error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Legacy: Update company CRM with search results
app.post('/api/update-crm', async (req, res) => {
    try {
        const { companyName, crmData } = req.body;

        if (!companyName || !crmData) {
            return res.status(400).json({ error: 'Company name and CRM data are required' });
        }

        const updated = await supabase.updateCompanyCRM(companyName, crmData);
        res.json(updated);
    } catch (error) {
        console.error('Update CRM error:', error);
        res.status(500).json({ error: error.message });
    }
});

// NEW: Perplexity API endpoint
app.post('/api/search/perplexity', async (req, res) => {
    try {
        const { companyName, website } = req.body;

        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        const perplexityResults = await googleSearch.searchWithPerplexity(companyName, website);
        res.json({
            success: true,
            data: perplexityResults,
            source: 'perplexity'
        });

    } catch (error) {
        console.error('Perplexity search error:', error);
        res.status(500).json({
            error: error.message,
            source: 'perplexity'
        });
    }
});

// NEW: Save audit to database
app.post('/api/save-audit', async (req, res) => {
    try {
        const { companyData, crmData, audit, auditStatus } = req.body;

        if (!companyData || !crmData || !audit) {
            return res.status(400).json({
                error: 'Company data, CRM data, and audit are required'
            });
        }

        // Save audit to database
        const savedAudit = await supabase.saveAudit(
            companyData,
            crmData,
            audit,
            auditStatus
        );

        res.json({
            success: true,
            message: 'Audit saved successfully',
            data: savedAudit
        });
    } catch (error) {
        console.error('Save audit error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 CRM Search API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 