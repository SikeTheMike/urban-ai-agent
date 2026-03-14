export const DATABASE_SCHEMA = `
CATALOG: workspace
SCHEMA: urban_ai
PRIMARY TABLE: urban_ai.grocery_safety_index (Columns: store_name, city, zip_code, total_crimes, population, priority_score)
`;

export function buildPrompt(question: string) {
  return `
You are an elite Data Engineer AI for AURA. Map the user's intent to the schema.
Return ONLY pure Databricks SQL. No markdown (\`\`\`), no conversational text.
CRITICAL SQL RULES (DO NOT BREAK):
1. SELECT MUST EXACTLY BE: SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g
2. SQL ORDER: SELECT -> FROM -> WHERE -> GROUP BY -> ORDER BY -> LIMIT.
3. GROUP BY MUST EXACTLY BE: GROUP BY g.store_name, g.city, g.zip_code
4. ONLY use a WHERE clause if a real city name is mentioned. NEVER filter by words like "planning", "neighbourhood", "routes", or "transit".
================================================
DEMO OVERRIDES (IF THE QUESTION CONTAINS THESE KEYWORDS, OUTPUT THIS EXACT SQL):
IF QUESTION CONTAINS "safety lighting" OR "prioritise":
SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g GROUP BY g.store_name, g.city, g.zip_code ORDER BY MAX(g.priority_score) DESC LIMIT 3;
IF QUESTION CONTAINS "social vulnerability" OR "10% increase":
SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g GROUP BY g.store_name, g.city, g.zip_code ORDER BY MAX(g.priority_score) DESC, MAX(g.total_crimes) DESC LIMIT 3 OFFSET 3;
IF QUESTION CONTAINS "dependable routes" OR "transit":
SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g GROUP BY g.store_name, g.city, g.zip_code ORDER BY MAX(g.priority_score) ASC LIMIT 3;
================================================
GENERAL DYNAMIC LOGIC (If it is a random question):
- "Safest", "Best" -> ORDER BY MAX(g.priority_score) ASC
- "Dangerous", "Worst" -> ORDER BY MAX(g.priority_score) DESC
- City filter example -> WHERE LOWER(g.city) LIKE '%phoenix%'
User Question:
${question}
Final SQL:
`;
}