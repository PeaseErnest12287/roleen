require("dotenv").config();
const { Pool } = require("pg");

// Database connection setup (Using NeonDB)
const dbUrl = "postgresql://neondb_owner:npg_K3Jz0surUSTE@ep-red-recipe-a9av8rxt-pooler.gwc.azure.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

// Function to create the "alive" table if it doesn't exist
async function createTableAlive() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alive (
        id SERIAL PRIMARY KEY,
        message TEXT,
        lien TEXT
      );
    `);
    console.log("✅ Table 'alive' created or already exists.");
  } catch (error) {
    console.error("❌ Error creating 'alive' table:", error);
  }
}

// Function to add or update a record in "alive" table
async function addOrUpdateAlive(message, lien) {
  try {
    await pool.query(`
      INSERT INTO alive (id, message, lien)
      VALUES (1, $1, $2)
      ON CONFLICT (id)
      DO UPDATE SET message = EXCLUDED.message, lien = EXCLUDED.lien;
    `, [message, lien]);

    console.log("✅ Data added/updated in 'alive' table successfully.");
  } catch (error) {
    console.error("❌ Error updating 'alive' table:", error);
  }
}

// Function to fetch data from "alive" table
async function getAliveData() {
  try {
    const result = await pool.query("SELECT message, lien FROM alive WHERE id = 1");

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      console.log("⚠️ No data found in 'alive' table.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching data from 'alive' table:", error);
    return null;
  }
}

// Run table creation on startup
createTableAlive();

module.exports = {
  addOrUpdateAlive,
  getAliveData,
};
