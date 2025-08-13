import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!')
  console.error('Please check your .env file in the frontend directory and ensure:')
  console.error('- VITE_SUPABASE_URL is set')
  console.error('- VITE_SUPABASE_ANON_KEY is set')
  throw new Error('Supabase environment variables are required. Check console for details.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 