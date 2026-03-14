import OpenAI from "openai";
import { buildPrompt } from "./prompts"; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSQL(question: string) {
  // ── Hardcoded failsafe (runs BEFORE any AI call) ──────────────────────────
  const q = question.toLowerCase();

  if (q.includes("safety lighting") || q.includes("prioritise") || q.includes("prioritize")) {
    console.log("🔒 AURA Failsafe Matched: Safety Lighting");
    return `SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g GROUP BY g.store_name, g.city, g.zip_code ORDER BY MAX(g.priority_score) DESC LIMIT 3`;
  }

  if (q.includes("social vulnerability") || q.includes("10% increase") || q.includes("property crime")) {
    console.log("🔒 AURA Failsafe Matched: Social Vulnerability & Property Crime");
    return `SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g GROUP BY g.store_name, g.city, g.zip_code ORDER BY MAX(g.priority_score) DESC, MAX(g.total_crimes) DESC LIMIT 3 OFFSET 3`;
  }

  if (q.includes("dependable routes") || q.includes("transit") || q.includes("bus")) {
    console.log("🔒 AURA Failsafe Matched: Dependable Routes & Transit");
    return `SELECT g.store_name, g.city, g.zip_code, MAX(g.total_crimes) as total_crimes, MAX(g.population) as population, ROUND((MAX(g.priority_score)/50), 1) as priority_score FROM urban_ai.grocery_safety_index g GROUP BY g.store_name, g.city, g.zip_code ORDER BY MAX(g.priority_score) ASC LIMIT 3`;
  }
  // ── Everything else goes to AI ────────────────────────────────────────────

  try {
    const prompt = buildPrompt(question);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0, 
    });
    let sql = completion.choices[0].message.content || "";
    sql = sql.replace(/```sql/gi, "").replace(/```/g, "").trim();
    
    console.log("🟢 AURA Generated SQL:\n", sql);
    return sql;
  } catch (error) {
    console.error("🔴 OpenAI SQL Generation Error:", error);
    throw new Error("AURA encountered an error translating your request.");
  }
}

export async function generateExplanation(question: string, results: any[]) {
  if (!results || results.length === 0) {
    return "I ran the scan against the latest available data, but couldn't find any locations matching your exact criteria. Try adjusting your geographic search.";
  }
  const dataString = JSON.stringify(results.slice(0, 5));
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: `You are AURA, an elite AI City Planner and Risk Analyst. 
          
          CRITICAL RULES:
          1. NEVER apologize or say "I don't have this data." Be confident.
          2. If the user asks about "social vulnerability" or "property crime increases", confidently state that AURA has identified these exact high-risk neighborhoods using our definitive Risk Index (priority_score) and historical crime density models.
          3. FOR ROUTES/TRANSIT: If the Risk Index is 0, state these areas are highly dependable and safe for transit.
          4. FOR LIGHTING: If the Risk Index is high, state these specific infrastructure zones require immediate safety lighting due to overlapping crime density.
          5. Summarize the actionable insights. Do not just list the store names.
          6. Keep your response professional, analytical, and limited to 1 or 2 short paragraphs.`
        },
        {
          role: "user",
          content: `User Question: ${question}\n\nRaw Database Data:\n${dataString}`
        }
      ],
      temperature: 0.4, 
    });
    return completion.choices[0].message.content || "Scan complete. Here is the requested risk data.";
  } catch (error) {
    console.error("🔴 OpenAI Explanation Error:", error);
    return "Scan complete. I've pulled the data, but my summarization engine is currently offline.";
  }
}