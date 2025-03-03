require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

// Database connection setup (Using NeonDB)
const dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgresql://neondb_owner:npg_K3Jz0surUSTE@ep-red-recipe-a9av8rxt-pooler.gwc.azure.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

// Function to create the "antibot" table if it doesn't exist
async function createAntibotTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS antibot (
        jid TEXT PRIMARY KEY,
        etat TEXT,
        action TEXT
      );
    `);
    console.log("✅ Table 'antibot' created or already exists.");
  } catch (error) {
    console.error("❌ Error creating 'antibot' table:", error);
  }
}

// Function to add or update a JID in the 'antibot' table
async function atbajouterOuMettreAJourJid(jid, etat) {
  try {
    await pool.query(`
      INSERT INTO antibot (jid, etat, action)
      VALUES ($1, $2, 'supp')
      ON CONFLICT (jid) 
      DO UPDATE SET etat = EXCLUDED.etat;
    `, [jid, etat]);

    console.log(`✅ JID ${jid} added or updated in 'antibot' table.`);
  } catch (error) {
    console.error("❌ Error updating JID in 'antibot' table:", error);
  }
}

// Function to update the action of a JID
async function atbmettreAJourAction(jid, action) {
  try {
    await pool.query(`
      INSERT INTO antibot (jid, etat, action)
      VALUES ($1, 'non', $2)
      ON CONFLICT (jid) 
      DO UPDATE SET action = EXCLUDED.action;
    `, [jid, action]);

    console.log(`✅ Action updated for JID ${jid} in 'antibot' table.`);
  } catch (error) {
    console.error("❌ Error updating action for JID:", error);
  }
}

// Function to check the status of a JID
async function atbverifierEtatJid(jid) {
  try {
    const result = await pool.query("SELECT etat FROM antibot WHERE jid = $1", [jid]);
    return result.rows.length > 0 && result.rows[0].etat === "oui";
  } catch (error) {
    console.error("❌ Error checking JID status:", error);
    return false;
  }
}

// Function to retrieve the action of a JID
async function atbrecupererActionJid(jid) {
  try {
    const result = await pool.query("SELECT action FROM antibot WHERE jid = $1", [jid]);
    return result.rows.length > 0 ? result.rows[0].action : "supp";
  } catch (error) {
    console.error("❌ Error retrieving JID action:", error);
    return "supp";
  }
}

// Run table creation on startup
createAntibotTable();

module.exports = {
  atbmettreAJourAction,
  atbajouterOuMettreAJourJid,
  atbverifierEtatJid,
  atbrecupererActionJid,
};
