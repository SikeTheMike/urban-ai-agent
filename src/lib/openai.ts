import OpenAI from "openai";
import { buildPrompt, buildExplanationPrompt } from "./prompts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─────────────────────────────────────────────────────────────
//  Normalize ANY table's result into the card format the
//  frontend expects: store_name, city, zip_code,
//                    total_crimes, population, priority_score
// ─────────────────────────────────────────────────────────────
export function normalizeResults(results: any[]): any[] {
  if (!results || results.length === 0) return [];

  return results.map((row) => {
    // ── grocery_safety_index ─────────────────────────────────
    // priority_score is unbounded raw score (e.g. 139, 3030 etc)
    // safety_score goes up to ~1000 (inverse — higher = safer)
    // Normalize priority_score to 0–100 using a sensible cap of 200
    if (row.priority_score !== undefined || row.safety_score !== undefined) {
      const rawPriority = Number(row.priority_score ?? 0);
      // Cap at 200, scale to 0-100
      const normalizedScore = Math.min(100, Math.round((rawPriority / 200) * 100));
      return {
        store_name:     row.store_name ?? null,
        city:           row.city ?? "Unknown",
        zip_code:       String(row.zip_code ?? ""),
        total_crimes:   Number(row.total_crimes ?? 0),
        population:     Number(row.population ?? 0),
        priority_score: normalizedScore,
      };
    }

    // ── zip_crime_summary ────────────────────────────────────
    if (row.crimes_per_1000_residents !== undefined || (row.zip_code && row.total_crimes !== undefined && row.store_name === undefined)) {
      const pop = Number(row.population ?? 1);
      const crimes = Number(row.total_crimes ?? 0);
      // Normalise to 0-100 scale: 200 crimes per 1000 = 100 score
      const riskScore = Math.min(100, Math.round((crimes / pop) * 5000));
      return {
        store_name:     null,
        city:           row.city ?? "Unknown",
        zip_code:       String(row.zip_code ?? ""),
        total_crimes:   crimes,
        population:     pop,
        priority_score: riskScore,
      };
    }

    // ── svi_clean ────────────────────────────────────────────
    if (row.vulnerability_score !== undefined || row.RPL_THEMES !== undefined) {
      const svi = Number(row.vulnerability_score ?? row.RPL_THEMES ?? 0);
      return {
        store_name:     row.LOCATION ?? row.location ?? null,
        city:           row.COUNTY ?? row.county ?? "Unknown",
        zip_code:       String(row.FIPS ?? row.fips ?? ""),
        total_crimes:   Math.round(Number(row.pct_poverty ?? row.EP_POV150 ?? 0)),
        population:     Number(row.population ?? row.E_TOTPOP ?? 0),
        priority_score: Math.min(100, Math.round(svi * 100)),
      };
    }

    // ── snap_retailers ───────────────────────────────────────
    if (row.store_name !== undefined && row.store_type !== undefined) {
      return {
        store_name:     row.store_name,
        city:           row.city ?? "Unknown",
        zip_code:       String(row.zip_code ?? ""),
        total_crimes:   0,
        population:     0,
        priority_score: 0,
      };
    }

    // ── census_clean ─────────────────────────────────────────
    if (row.median_income !== undefined) {
      return {
        store_name:     null,
        city:           row.city ?? "Unknown",
        zip_code:       String(row.zip_code ?? ""),
        total_crimes:   0,
        population:     Number(row.population ?? 0),
        priority_score: Math.min(100, Math.round(Number(row.poverty_rate ?? 0) * 2)),
      };
    }

    // ── Generic fallback ─────────────────────────────────────
    return {
      store_name:     row.store_name ?? null,
      city:           row.city ?? "Unknown",
      zip_code:       String(row.zip_code ?? ""),
      total_crimes:   Number(row.total_crimes ?? 0),
      population:     Number(row.population ?? 0),
      priority_score: Number(row.priority_score ?? 0),
    };
  });
}

// ─────────────────────────────────────────────────────────────
//  SQL Generation — let the AI handle everything
// ─────────────────────────────────────────────────────────────
export async function generateSQL(question: string): Promise<string> {
  try {
    const prompt = buildPrompt(question);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0,
    });

    let sql = completion.choices[0].message.content ?? "";
    // Strip any accidental markdown fences
    sql = sql.replace(/```sql/gi, "").replace(/```/g, "").trim();

    // Safety: block any mutating statements
    const upper = sql.toUpperCase().trimStart();
    if (
      !upper.startsWith("SELECT") ||
      upper.includes("DELETE ") ||
      upper.includes("UPDATE ") ||
      upper.includes("INSERT ") ||
      upper.includes("DROP ") ||
      upper.includes("ALTER ") ||
      upper.includes("CREATE ")
    ) {
      throw new Error("AURA blocked a non-SELECT query.");
    }

    console.log("🟢 AURA SQL:\n", sql);
    return sql;
  } catch (error) {
    console.error("🔴 SQL generation error:", error);
    throw new Error("AURA couldn't translate your question into a query. Try rephrasing.");
  }
}

// ─────────────────────────────────────────────────────────────
//  Explanation Generation
// ─────────────────────────────────────────────────────────────
export async function generateExplanation(question: string, results: any[]): Promise<string> {
  if (!results || results.length === 0) {
    return "No data matched that query. Try being more specific — include a city name like 'Phoenix', or use phrases like 'highest risk', 'safest areas', or 'most vulnerable ZIP codes'.";
  }

  try {
    const prompt = buildExplanationPrompt(question, results);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.35,
    });
    return completion.choices[0].message.content ?? "Analysis complete.";
  } catch (error) {
    console.error("🔴 Explanation error:", error);
    return "Data retrieved successfully.";
  }
}