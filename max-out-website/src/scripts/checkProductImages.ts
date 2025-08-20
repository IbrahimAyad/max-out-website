import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkProductImages() {
  try {
    console.log('Checking product images...');
    // Add your image checking logic here
    console.log('Product image check completed');
  } catch (error) {
    console.error('Error checking product images:', error);
  }
}
