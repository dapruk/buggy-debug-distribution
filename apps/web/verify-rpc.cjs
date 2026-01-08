const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://shdlfgbbfjtukiafwrky.supabase.co";
const supabaseAnonKey = "sb_publishable_5T908lx5_nA918HiY36eyw_GwPcwDMx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpc() {
  console.log("Testing get_products_with_stock...");
  const { data, error } = await supabase.rpc("get_products_with_stock");
  if (error) {
    console.error("Error:", error);
    process.exit(1);
  } else {
    console.log("Success! Data length:", data ? data.length : 0);
    if (data && data.length > 0) {
      console.log("Sample:", data[0]);
    }
    process.exit(0);
  }
}

testRpc();
