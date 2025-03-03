const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_K3Jz0surUSTE@ep-red-recipe-a9av8rxt-pooler.gwc.azure.neon.tech/neondb?sslmode=require"
});

client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Connection Error:", err))
  .finally(() => client.end());
