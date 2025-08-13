-- Add Facebook column to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS facebook TEXT;

-- Create index for Facebook column
CREATE INDEX IF NOT EXISTS idx_companies_facebook ON companies(facebook);

-- Update existing records to have empty Facebook field
UPDATE companies SET facebook = NULL WHERE facebook IS NULL; 