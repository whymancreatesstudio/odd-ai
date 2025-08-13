-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Audits Table for storing comprehensive company audits
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    website TEXT,
    company_data JSONB NOT NULL,
    crm_data JSONB NOT NULL,
    audit_content JSONB NOT NULL,
    audit_status TEXT DEFAULT 'Draft' CHECK (audit_status IN ('Draft', 'Approved', 'Sent')),
    generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_audits_company_name ON audits(company_name);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(audit_status);
CREATE INDEX IF NOT EXISTS idx_audits_generated_date ON audits(generated_date);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at);

-- Create Updated At Trigger Function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Trigger for Updated At
DROP TRIGGER IF EXISTS update_audits_updated_at ON audits;
CREATE TRIGGER update_audits_updated_at 
    BEFORE UPDATE ON audits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Basic - allow all operations for now)
-- You can customize these based on your authentication needs
CREATE POLICY "Allow all operations on audits" ON audits FOR ALL USING (true);

-- Grant permissions (adjust based on your Supabase setup)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Insert sample audit statuses
INSERT INTO audits (company_name, website, company_data, crm_data, audit_content, audit_status) 
VALUES (
    'Sample Company',
    'https://sample.com',
    '{"companyName": "Sample Company", "industry": "SaaS"}',
    '{"funding": "Unknown", "revenue": "Unknown"}',
    '{"companyOverview": {"profile": "Sample audit content"}}',
    'Draft'
) ON CONFLICT DO NOTHING; 