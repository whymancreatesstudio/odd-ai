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

// Perplexity API endpoint (replacing Google Search)
app.post('/api/search', async (req, res) => {
    try {
        const { query, companyName, searchType, website } = req.body;

        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        // Use Perplexity API for all search types
        const results = await googleSearch.searchWithPerplexity(companyName, website);
        res.json({
            success: true,
            data: results,
            source: 'perplexity',
            searchType: searchType || 'comprehensive'
        });
    } catch (error) {
        console.error('Perplexity search error:', error);
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

        // Return appropriate status codes based on error type
        if (error.message.includes('blocking automated requests')) {
            res.status(403).json({ error: error.message });
        } else if (error.message.includes('Website not found')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Website server error')) {
            res.status(502).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
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

        // Use Perplexity API for comprehensive search
        const comprehensiveResults = await googleSearch.searchWithPerplexity(companyName);

        // Transform to match expected format
        const transformedResults = {
            companyName,
            funding: { results: comprehensiveResults.funding ? [{ title: "Funding", snippet: comprehensiveResults.funding }] : [] },
            news: { results: comprehensiveResults.news ? [{ title: "News", snippet: comprehensiveResults.news }] : [] },
            jobs: { results: comprehensiveResults.hiring ? [{ title: "Jobs", snippet: comprehensiveResults.hiring }] : [] },
            people: { results: comprehensiveResults.people ? [{ title: "People", snippet: comprehensiveResults.people }] : [] },
            company: { results: comprehensiveResults.company ? [{ title: "Company", snippet: comprehensiveResults.company }] : [] },
            searchDate: new Date().toISOString(),
            source: 'perplexity'
        };

        res.json(transformedResults);
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
const NODE_ENV = process.env.NODE_ENV || 'development';
app.listen(PORT, () => {
    // CRM Search API server running on port ${PORT}
    if (NODE_ENV === 'development') {
        // Health check: http://localhost:${PORT}/api/health
    } else {
        // Production server running on port ${PORT}
    }
}); 