require('dotenv').config(); // Load environment variables from .env

const { Client } = require('pg');

// Configuration now uses environment variables
const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Default to 5432 if not set
};

async function runSQLFile(filePath) {
  try {
    const client = new Client(config);
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Read the SQL file
    const fs = require('fs').promises;
    const sql = await fs.readFile(filePath, 'utf8');

    // PostgreSQL doesn't support multiple statements in a single query execution like MySQL,
    // but we can handle this by splitting and executing each statement separately.
    const statements = sql.split(';').filter(Boolean);

    // Execute each SQL statement
    for (const statement of statements) {
      const cleanedStatement = statement.trim();
      if (cleanedStatement) {
        // Execute the statement
        await client.query(cleanedStatement);
        console.log(`Executed: ${cleanedStatement}`);
      }
    }

    await client.end();
    console.log('Database operations completed. Connection closed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
  finally
  {
    process.exit();
  }
}

runSQLFile('./db/schema.sql');