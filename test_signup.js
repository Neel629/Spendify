const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSignup() {
  const email = `test_${Date.now()}@example.com`;
  console.log('Testing signup with', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: { full_name: 'Test User' }
    }
  });

  if (error) {
    console.error('SIGNUP ERROR:', error.message);
  } else {
    console.log('SIGNUP SUCCESS!', data.user.id);
  }
}

testSignup();
