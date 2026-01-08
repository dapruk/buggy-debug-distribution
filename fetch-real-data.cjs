const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env
const envPath = path.resolve(__dirname, 'apps/web/.env');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('Could not read .env file:', e.message);
    process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    console.log('Found keys:', Object.keys(env));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchData() {
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('name, sku, price, is_active')
        .limit(5);

    if (prodError) console.error('Error fetching products:', prodError);
    else {
        console.log('--- PRODUCTS ---');
        console.log(JSON.stringify(products, null, 2));
    }

    const { data: vendors, error: vendError } = await supabase
        .from('vendors')
        .select('name, code, is_active')
        .limit(5);

    if (vendError) console.error('Error fetching vendors:', vendError);
    else {
        console.log('--- VENDORS ---');
        console.log(JSON.stringify(vendors, null, 2));
    }
}

fetchData();
