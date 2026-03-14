import { DBSQLClient } from "@databricks/sql";

export async function runQuery(sql: string) {
  // MUST be inside the function so it creates a fresh instance every time
  const client = new DBSQLClient();

  try {
    // Authenticate and connect
    await client.connect({
      host: process.env.DATABRICKS_HOST!,
      path: process.env.DATABRICKS_HTTP_PATH!,
      token: process.env.DATABRICKS_TOKEN!
    });

    // Open the session directly from the client
    const session = await client.openSession();

    console.log("Executing SQL on Databricks:", sql); 

    const queryOperation = await session.executeStatement(sql);
    
    // Fetch the actual JSON rows
    const result = await queryOperation.fetchAll();

    // Close everything down in reverse order to save compute costs
    await queryOperation.close();
    await session.close();
    await client.close(); 

    return result;

  } catch (error) {
    console.error("🔥 Databricks Execution Error:", error);
    // Ensure we close the client even if it crashed to prevent memory leaks
    await client.close(); 
    throw error;
  }
}