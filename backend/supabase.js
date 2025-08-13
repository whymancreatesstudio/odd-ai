const { createClient } = require('@supabase/supabase-js');

class SupabaseClient {
    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );
    }

    async saveSearchResults(companyData, searchResults) {
        try {
            const { data, error } = await this.supabase
                .from('search_results')
                .insert([{
                    company_name: companyData.companyName,
                    company_data: companyData,
                    search_results: searchResults,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to save search results: ${error.message}`);
        }
    }

    async getSearchHistory(companyName) {
        try {
            const { data, error } = await this.supabase
                .from('search_results')
                .select('*')
                .eq('company_name', companyName)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to get search history: ${error.message}`);
        }
    }

    async updateCompanyCRM(companyName, crmData) {
        try {
            const { data, error } = await this.supabase
                .from('companies')
                .update({
                    crm_details: crmData,
                    updated_at: new Date().toISOString()
                })
                .eq('company_name', companyName);

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update company CRM: ${error.message}`);
        }
    }

    // NEW: Save final results to both tables
    async saveFinalResults(companyData, aiInsights, searchResults, officialCompanyName, userNotes) {
        try {
            const timestamp = new Date().toISOString();

            // 1. Save to companies table (basic profile)
            const { data: companyData, error: companyError } = await this.supabase
                .from('companies')
                .insert([{
                    company_name: companyData.companyName,
                    official_company_name: officialCompanyName || companyData.companyName,
                    website: companyData.website,
                    industry: companyData.industry,
                    location: companyData.location,
                    notes: userNotes || companyData.notes,
                    created_at: timestamp,
                    updated_at: timestamp
                }]);

            if (companyError) throw companyError;

            // 2. Save to crm_results table (comprehensive data)
            const { data: crmData, error: crmError } = await this.supabase
                .from('crm_results')
                .insert([{
                    company_name: companyData.companyName,
                    website: companyData.website,
                    official_company_name: officialCompanyName || companyData.companyName,
                    ai_insights: aiInsights,
                    raw_search_data: searchResults,
                    search_sources: {
                        google_search: true,
                        ai_analysis: true,
                        search_quality: searchResults.searchQuality || 0
                    },
                    user_notes: userNotes || companyData.notes,
                    created_at: timestamp,
                    updated_at: timestamp
                }]);

            if (crmError) throw crmError;

            return {
                company: companyData,
                crm: crmData,
                message: 'Data saved successfully to both tables'
            };
        } catch (error) {
            throw new Error(`Failed to save final results: ${error.message}`);
        }
    }
}

module.exports = new SupabaseClient(); 