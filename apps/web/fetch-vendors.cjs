const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://shdlfgbbfjtukiafwrky.supabase.co";
const supabaseAnonKey = "sb_publishable_5T908lx5_nA918HiY36eyw_GwPcwDMx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchVendors() {
  console.log("Fetching vendors...");
  const { data, error } = await supabase.from("vendors").select("*");
  if (error) {
    console.error("Error:", error);
    process.exit(1);
  } else {
    console.log("Vendors:", data);
    process.exit(0);
  }
}

fetchVendors();
