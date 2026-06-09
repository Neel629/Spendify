const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  const tables = ['profiles', 'user_streaks', 'categories', 'transactions', 'budgets', 'savings_goals'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`[${table}] ERROR:`, error.message);
    } else {
      console.log(`[${table}] EXISTS`);
    }
  }
}

checkTables();
