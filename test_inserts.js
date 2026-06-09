const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInserts() {
  // First, we need to sign up to get a real user ID and token
  const email = `test_${Date.now()}@example.com`;
  console.log('Testing manual inserts for:', email);
  
  // Try to sign up - it will fail with "Database error" but the user might actually be created in Auth!
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
  });
  
  // Wait, if signup fails, does it return the user? Let's sign in with a known credential.
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'neel@example.com', // I'll assume they used something like this, or I'll just create a completely random user.
    password: 'password123'
  })
}

testInserts();
