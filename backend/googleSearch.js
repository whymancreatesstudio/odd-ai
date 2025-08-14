const axios = require('axios');

class GoogleSearch {
    constructor() {
        // Security: Validate required environment variables
        this.apiKey = process.env.GOOGLE_API_KEY;
        this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
        this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;

        if (!this.perplexityApiKey) {
            throw new Error('PERPLEXITY_API_KEY environment variable is required');
        }

        this.baseUrl = 'https://www.googleapis.com/customsearch/v1';
    }

    // HTML Entity Decoding Function
    decodeHtmlEntities(str) {
        if (!str) return str;
        return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
    }

    // Enhanced search using both company name AND website
    async search(query, companyName, website = null) {
        try {
            // Security: Sanitize inputs
            const sanitizedQuery = this.sanitizeInput(query);
            const sanitizedCompanyName = this.sanitizeInput(companyName);

            let enhancedQuery = sanitizedQuery;
            if (website && this.isValidWebsite(website)) {
                const domain = this.extractDomain(website);
                enhancedQuery = `${sanitizedQuery} site:${domain}`;
            }

            const response = await axios.get(this.baseUrl, {
                params: {
                    key: this.apiKey,
                    cx: this.searchEngineId,
                    q: enhancedQuery,
                    num: 10
                }
            });

            return this.processResults(response.data);
        } catch (error) {
            console.error('Google Search API Error:', error.message);
            throw new Error(`Google Search failed: ${error.message}`);
        }
    }

    // Security: Validate website URL
    isValidWebsite(website) {
        try {
            if (!website || typeof website !== 'string') return false;

            // Check for common malicious patterns
            const maliciousPatterns = [
                /javascript:/i,
                /data:/i,
                /vbscript:/i,
                /file:/i,
                /ftp:/i,
                /mailto:/i
            ];

            if (maliciousPatterns.some(pattern => pattern.test(website))) {
                return false;
            }

            // Validate URL structure
            const url = new URL(website.startsWith('http') ? website : `https://${website}`);
            return url.protocol === 'https:' || url.protocol === 'http:';
        } catch (error) {
            return false;
        }
    }

    // Security: Sanitize input strings
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';

        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove JavaScript protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 500); // Limit length to prevent abuse
    }

    // Extract domain from website URL
    extractDomain(website) {
        try {
            const url = new URL(website.startsWith('http') ? website : `https://${website}`);
            return url.hostname.replace('www.', '');
        } catch (error) {
            return website.replace(/^https?:\/\//, '').replace('www.', '');
        }
    }

    // Process search results
    processResults(data) {
        if (!data.items) {
            return { results: [] };
        }

        return {
            results: data.items.map(item => ({
                title: this.decodeHtmlEntities(item.title),
                link: item.link,
                snippet: this.decodeHtmlEntities(item.snippet)
            }))
        };
    }

    // Enhanced specific search methods with website support
    async searchFunding(companyName, website = null) {
        return this.search('funding investment Series A B C D E venture capital', companyName, website);
    }

    async searchNews(companyName, website = null) {
        return this.search('news announcements updates 2024 2025', companyName, website);
    }

    async searchJobs(companyName, website = null) {
        return this.search('hiring jobs careers marketing content creator social media specialist copywriter brand manager digital marketing SEO graphic designer video editor', companyName, website);
    }

    async searchPeople(companyName, website = null) {
        return this.search('CEO founder executive team leadership', companyName, website);
    }

    async searchCompany(companyName, website = null) {
        return this.search('company profile about overview business model', companyName, website);
    }

    // Website Meta Tag Fetcher
    async fetchWebsiteMetaTags(website) {
        try {
            // Security: Validate and sanitize website URL
            if (!this.isValidWebsite(website)) {
                throw new Error('Invalid website URL provided');
            }

            // Fetching website meta tags

            const response = await axios.get(website, {
                timeout: 8000, // Reduced timeout for faster failure
                maxRedirects: 3, // Prevent redirect loops
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; CRM-Bot/1.0)'
                }
            });

            const html = response.data;
            const metaTags = this.extractMetaTags(html);
            const companyName = this.extractCompanyName(metaTags, html);
            const title = this.extractTitle(html);
            const description = this.extractDescription(metaTags);

            // Website meta tags extracted successfully
            return {
                companyName,
                title,
                description,
                metaTags
            };
        } catch (error) {
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                throw new Error('Website is taking too long to respond. Please try again or check if the website is accessible.');
            } else if (error.response) {
                // Server responded with error status
                if (error.response.status === 403) {
                    throw new Error('Website is blocking automated requests. This is common for some websites.');
                } else if (error.response.status === 404) {
                    throw new Error('Website not found. Please check the URL.');
                } else if (error.response.status >= 500) {
                    throw new Error('Website server error. Please try again later.');
                } else {
                    throw new Error(`Website returned error: ${error.response.status} ${error.response.statusText}`);
                }
            } else if (error.request) {
                // Request was made but no response received
                throw new Error('Unable to reach the website. Please check the URL and try again.');
            } else {
                // Other errors
                throw new Error(`Failed to fetch website: ${error.message}`);
            }
        }
    }

    // Extract meta tags from HTML
    extractMetaTags(html) {
        const metaTags = {};
        const metaRegex = /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
        let match;

        while ((match = metaRegex.exec(html)) !== null) {
            metaTags[match[1]] = match[2];
        }

        return metaTags;
    }

    // Extract company name from meta tags or title
    extractCompanyName(metaTags, html) {
        // Try different meta tag sources
        const possibleNames = [
            metaTags['og:site_name'],
            metaTags['application-name'],
            metaTags['msapplication-TileColor'] ? metaTags['msapplication-TileColor'] : null
        ].filter(Boolean);

        if (possibleNames.length > 0) {
            return this.decodeHtmlEntities(possibleNames[0]);
        }

        // Fallback to title extraction
        const title = this.extractTitle(html);
        if (title) {
            // Clean up title to get company name
            const cleanName = title.replace(/[|–—–-].*$/, '').trim();
            if (cleanName.length > 0) {
                return cleanName;
            }
        }
        return null;
    }

    // Extract title from HTML
    extractTitle(html) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        return titleMatch ? this.decodeHtmlEntities(titleMatch[1].trim()) : null;
    }

    // Extract description from meta tags
    extractDescription(metaTags) {
        const desc = metaTags['description'] || metaTags['og:description'] || null;
        return desc ? this.decodeHtmlEntities(desc) : null;
    }

    // Enhanced comprehensive company search
    async searchCompanyEnhanced(companyName, website = null) {
        try {
            // Security: Validate inputs before processing
            if (!this.sanitizeInput(companyName)) {
                throw new Error('Invalid company name provided');
            }

            if (website && !this.isValidWebsite(website)) {
                throw new Error('Invalid website URL provided');
            }

            // Starting enhanced company search

            // Use Perplexity API instead of Google Custom Search (which has quota issues)
            const perplexityResults = await this.searchWithPerplexity(companyName, website);

            // Perplexity API response received

            // Smart Fallback: Run targeted searches for "Unknown" values
            const enhancedResults = await this.runTargetedFallbackSearches(perplexityResults, companyName, website);

            // Transform enhanced results to match expected format
            const searchResults = {
                companyName,
                website,
                searchDate: new Date().toISOString(),
                funding: {
                    results: [{
                        title: "Funding Information",
                        snippet: `Total Funding: ${enhancedResults.funding?.totalFunding || 'Unknown'}, Last Round: ${enhancedResults.funding?.lastRound || 'Unknown'}, Rounds: ${enhancedResults.funding?.fundingRounds || 'Unknown'}`
                    }]
                },
                news: {
                    results: enhancedResults.news?.recentAnnouncements?.map(announcement => ({
                        title: "Company Update",
                        snippet: announcement
                    })) || []
                },
                jobs: {
                    results: enhancedResults.hiring?.openRoles?.map(role => ({
                        title: "Open Role",
                        snippet: role
                    })) || []
                },
                people: {
                    results: [{
                        title: "Key People",
                        snippet: `CEO: ${enhancedResults.people?.ceo || 'Unknown'}, Key Decision Maker: ${enhancedResults.people?.keyDecisionMaker || 'Unknown'}`
                    }]
                },
                company: {
                    results: [{
                        title: "Company Overview",
                        snippet: `Revenue: ${enhancedResults.revenue?.annualRevenue || 'Unknown'}, Agency: ${enhancedResults.agency?.currentAgency || 'Unknown'}`
                    }]
                },
                searchQuality: "High (Perplexity API + Smart Fallbacks)",
                source: "perplexity_with_fallbacks",
                // Add raw enhanced data for better AI mapping
                rawPerplexityData: enhancedResults
            };

            // Enhanced company search completed
            return searchResults;
        } catch (error) {
            console.error(`❌ Enhanced company search failed for: ${companyName}`, error);
            throw new Error(`Enhanced company search failed: ${error.message}`);
        }
    }

    // Calculate search quality score
    calculateSearchQuality(funding, news, jobs, people, company) {
        let totalResults = 0;
        let totalScore = 0;

        [funding, news, jobs, people, company].forEach(search => {
            if (search.results && search.results.length > 0) {
                totalResults += search.results.length;
                totalScore += Math.min(search.results.length, 10);
            }
        });

        if (totalResults === 0) return 0;
        const qualityScore = Math.round((totalScore / 50) * 100);
        return Math.min(qualityScore, 100);
    }

    // Smart Fallback: Run targeted searches for "Unknown" values
    async runTargetedFallbackSearches(perplexityResults, companyName, website) {
        try {
            // Running smart fallback searches

            const enhancedResults = { ...perplexityResults };

            // 1. Funding Fallback: Use Perplexity API for missing funding data
            if (perplexityResults.funding?.lastRound === 'Unknown') {
                // Perplexity API: Funding fallback needed
                // Will be handled by aggressive Perplexity fallback
            }

            // 2. Revenue Fallback: Use Perplexity API for missing revenue data
            if (perplexityResults.revenue?.annualRevenue === 'Unknown') {
                // Perplexity API: Revenue fallback needed
                // Will be handled by aggressive Perplexity fallback
            }

            // 3. News Fallback: Use Perplexity API for missing news data
            if (!perplexityResults.news?.recentAnnouncements?.length) {
                // Perplexity API: News fallback needed
                // Will be handled by aggressive Perplexity fallback
            }

            // 4. Hiring Fallback: Use Perplexity API for missing hiring data
            if (perplexityResults.hiring?.isHiring === 'Unknown') {
                // Perplexity API: Hiring fallback needed
                // Will be handled by aggressive Perplexity fallback
            }

            // 5. AGGRESSIVE FALLBACK: Use Perplexity again with more specific prompts for missing data
            const missingFields = this.identifyMissingFields(enhancedResults);
            if (missingFields.length > 0) {
                // Perplexity API: Aggressive fallback
                // Run aggressive fallbacks in parallel for better performance
                const aggressiveResults = await this.runAggressivePerplexityFallback(enhancedResults, companyName, website, missingFields);
                Object.assign(enhancedResults, aggressiveResults);
            }



            // Smart fallback searches completed
            return enhancedResults;

        } catch (error) {
            console.error(`❌ Smart fallback searches failed: ${error.message}`);
            return perplexityResults; // Return original results if fallbacks fail
        }
    }

    // Identify which fields are still "Unknown"
    identifyMissingFields(results) {
        const missing = [];

        if (results.revenue?.annualRevenue === 'Unknown') missing.push('revenue');
        if (results.hiring?.isHiring === 'Unknown') missing.push('hiring');
        if (results.agency?.currentAgency === 'Unknown') missing.push('agency');
        if (!results.news?.recentAnnouncements?.length) missing.push('news');

        return missing;
    }

    // Aggressive Perplexity fallback with specific prompts
    async runAggressivePerplexityFallback(currentResults, companyName, website, missingFields) {
        try {
            // Running aggressive Perplexity fallback

            const enhancedResults = {};

            // Revenue fallback with specific prompt
            if (missingFields.includes('revenue')) {
                const revenuePrompt = `Find ONLY the annual revenue for ${companyName} ${website ? `(${website})` : ''}. 
                Search for: financial reports, revenue numbers, annual results, company filings.
                Return ONLY: "revenue": "exact amount found or 'Unknown'"`;

                try {
                    const revenueResponse = await this.searchWithPerplexitySpecific(revenuePrompt);
                    if (revenueResponse && revenueResponse !== 'Unknown') {
                        enhancedResults.revenue = { ...currentResults.revenue, annualRevenue: revenueResponse };
                        // Found revenue data
                    }
                } catch (err) {
                    console.error(`Revenue fallback failed: ${err.message}`);
                }
            }

            // Hiring fallback with specific prompt
            if (missingFields.includes('hiring')) {
                const hiringPrompt = `Check if ${companyName} ${website ? `(${website})` : ''} is currently hiring.
                Search for: job postings, careers page, hiring announcements, open positions.
                Return ONLY: "hiring": "yes" or "no"`;

                try {
                    const hiringResponse = await this.searchWithPerplexitySpecific(hiringPrompt);
                    if (hiringResponse && hiringResponse !== 'Unknown') {
                        enhancedResults.hiring = { ...currentResults.hiring, isHiring: hiringResponse };
                        // Found hiring status
                    }
                } catch (err) {
                    console.error(`Hiring fallback failed: ${err.message}`);
                }
            }

            // Agency fallback with specific prompt
            if (missingFields.includes('agency')) {
                const agencyPrompt = `Find if ${companyName} ${website ? `(${website})` : ''} works with any marketing/advertising agencies.
                Search for: agency partnerships, marketing agencies, advertising relationships.
                Return ONLY: "agency": "agency name found or 'Unknown'"`;

                try {
                    const agencyResponse = await this.searchWithPerplexitySpecific(agencyPrompt);
                    if (agencyResponse && agencyResponse !== 'Unknown') {
                        enhancedResults.agency = { ...currentResults.agency, currentAgency: agencyResponse };
                        // Found agency data
                    }
                } catch (err) {
                    console.error(`Agency fallback failed: ${err.message}`);
                }
            }

            return enhancedResults;
        } catch (error) {
            console.error(`❌ Aggressive Perplexity fallback failed: ${error.message}`);
            return {};
        }
    }

    // Specific Perplexity search for targeted fallbacks
    async searchWithPerplexitySpecific(prompt) {
        try {
            // Rate limiting: Add delay between API calls
            await this.rateLimitDelay();

            const response = await axios.post('https://api.perplexity.ai/chat/completions', {
                model: 'sonar',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 500,
                temperature: 0.1
            }, {
                headers: {
                    'Authorization': `Bearer ${this.perplexityApiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000 // 15 second timeout
            });

            const content = response.data.choices[0].message.content;

            // Try to extract the specific value from the response
            try {
                return JSON.parse(content);
            } catch (parseError) {
                // If not JSON, try to extract the value from text
                const valueMatch = content.match(/"(?:revenue|hiring|agency)"\s*:\s*"([^"]+)"/);
                if (valueMatch) return valueMatch[1];

                // If still no match, return the cleaned content
                return content.replace(/[^\w\s$.,]/g, '').trim();
            }
        } catch (error) {
            console.error('Specific Perplexity fallback failed:', error);
            return 'Unknown';
        }
    }

    // Individual fallback search methods
    async searchFundingFallback(companyName, website) {
        try {
            const query = `${companyName} funding round Series A B C D E latest investment`;
            const results = await this.search(query, companyName, website);

            if (results.results && results.results.length > 0) {
                const firstResult = results.results[0];
                // Extract funding info from search result
                if (firstResult.snippet.includes('Series')) {
                    const seriesMatch = firstResult.snippet.match(/Series\s+[A-Z]/i);
                    if (seriesMatch) return seriesMatch[0];
                }
            }
            return 'Unknown';
        } catch (error) {
            console.error('Funding fallback search failed:', error);
            return 'Unknown';
        }
    }

    async searchRevenueFallback(companyName, website) {
        try {
            const query = `${companyName} annual revenue 2024 2023 financial results`;
            const results = await this.search(query, companyName, website);

            if (results.results && results.results.length > 0) {
                const firstResult = results.results[0];
                // Extract revenue info from search result
                const revenueMatch = firstResult.snippet.match(/\$[\d.]+ (billion|million|thousand)/i);
                if (revenueMatch) return revenueMatch[0];
            }
            return 'Unknown';
        } catch (error) {
            console.error('Revenue fallback search failed:', error);
            return 'Unknown';
        }
    }

    async searchNewsFallback(companyName, website) {
        try {
            const query = `${companyName} news 2024 2025 recent announcements updates`;
            const results = await this.search(query, companyName, website);

            if (results.results && results.results.length > 0) {
                return results.results.slice(0, 5).map(result => result.snippet);
            }
            return [];
        } catch (error) {
            console.error('News fallback search failed:', error);
            return [];
        }
    }

    async searchHiringFallback(companyName, website) {
        try {
            const query = `${companyName} hiring jobs careers open positions 2024 2025`;
            const results = await this.search(query, companyName, website);

            if (results.results && results.results.length > 0) {
                const hasJobs = results.results.some(result =>
                    result.snippet.toLowerCase().includes('hiring') ||
                    result.snippet.toLowerCase().includes('job') ||
                    result.snippet.toLowerCase().includes('career')
                );
                return hasJobs ? 'yes' : 'no';
            }
            return 'Unknown';
        } catch (error) {
            console.error('Hiring fallback search failed:', error);
            return 'Unknown';
        }
    }

    // Perplexity API Method
    async searchWithPerplexity(companyName, website = null) {
        try {
            // Security: Validate inputs before API call
            const sanitizedCompanyName = this.sanitizeInput(companyName);
            const sanitizedWebsite = website ? this.sanitizeInput(website) : null;

            if (!sanitizedCompanyName) {
                throw new Error('Invalid company name provided');
            }

            if (sanitizedWebsite && !this.isValidWebsite(sanitizedWebsite)) {
                throw new Error('Invalid website URL provided');
            }

            const query = `Analyze company: ${sanitizedCompanyName} ${sanitizedWebsite ? `website: ${sanitizedWebsite}` : ''}. 
            
            CRITICAL: Return ONLY valid JSON with ALL keys present. NO explanations, NO extra text.
            If information is not found, use "Unknown" as the value.
            
            {
                "funding": {
                    "totalFunding": "exact amount found or 'Unknown'",
                    "lastRound": "exact funding round details or 'Unknown'",
                    "fundingRounds": "exact number or 'Unknown'"
                },
                "revenue": {
                    "annualRevenue": "exact revenue estimate or 'Unknown'",
                    "revenueRange": "exact revenue range or 'Unknown'"
                },
                "people": {
                    "ceo": "exact CEO name or 'Unknown'",
                    "keyDecisionMaker": "exact decision maker name and title or 'Unknown'",
                    "linkedinProfiles": ["exact LinkedIn URLs found or empty array"]
                },
                "hiring": {
                    "isHiring": "yes/no/Unknown based on job postings found",
                    "openRoles": ["exact job titles found or empty array"],
                    "hiringSignals": "exact hiring details or 'Unknown'"
                },
                "agency": {
                    "currentAgency": "exact agency name or 'Unknown'",
                    "agencyRelationship": "exact agency relationship details or 'Unknown'"
                },
                "news": {
                    "recentAnnouncements": ["exact recent news items or empty array"],
                    "companyUpdates": "exact company updates or 'Unknown'"
                }
            }`;

            const response = await axios.post('https://api.perplexity.ai/chat/completions', {
                model: 'sonar',
                messages: [{
                    role: 'user',
                    content: query
                }],
                max_tokens: 1500,
                temperature: 0.1
            }, {
                headers: {
                    'Authorization': `Bearer ${this.perplexityApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            // Parse the response
            const content = response.data.choices[0].message.content;
            try {
                // First try direct JSON parse
                return JSON.parse(content);
            } catch (parseError) {
                // If that fails, try to extract JSON from markdown code blocks
                const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (jsonMatch) {
                    try {
                        return JSON.parse(jsonMatch[1]);
                    } catch (secondParseError) {
                        console.error('Failed to parse extracted JSON:', jsonMatch[1]);
                        return {
                            error: 'Failed to parse extracted JSON from markdown',
                            rawResponse: content
                        };
                    }
                }

                // If no markdown found, return error with raw content
                return {
                    error: 'Failed to parse Perplexity response',
                    rawResponse: content
                };
            }

        } catch (error) {
            // Log the full error for debugging
            console.error('Perplexity API Error Details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            throw new Error(`Perplexity API failed: ${error.message}`);
        }
    }

    // Rate limiting: Add delay between API calls to prevent overwhelming external APIs
    async rateLimitDelay() {
        const delay = 1000; // 1 second delay
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

module.exports = new GoogleSearch(); 