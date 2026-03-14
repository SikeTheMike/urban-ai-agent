export const DATABASE_SCHEMA = `
You are working with a Databricks SQL database.

The database contains the following tables:

Table: urban_priority_index
Description: Crime risk score by ZIP code

Columns:
- zip_code (string): ZIP code
- total_crimes (number): Total crimes recorded in that ZIP
- population (number): Population of the ZIP code
- priority_score (number): Crime risk score (higher = more crime per resident)



Table: grocery_safety_index
Description: Grocery stores mapped to crime risk of their ZIP code

Columns:
- store_name (string): Name of grocery store
- city (string): City where the store is located
- zip_code (string): ZIP code of the store
- total_crimes (number): Total crimes recorded in that ZIP
- population (number): Population of that ZIP code
- priority_score (number): Crime risk score for that ZIP code



Rules:
- Only generate SQL SELECT queries.
- Never generate UPDATE, DELETE, INSERT, or DROP queries.
- Always use the provided tables and columns.
`;