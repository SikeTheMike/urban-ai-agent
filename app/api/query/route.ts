import { NextResponse } from "next/server";
import { generateSQL, generateExplanation } from "@/src/lib/openai";
import { runQuery } from "@/src/lib/databricks";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question required" },
        { status: 400 }
      );
    }

    // 1. Get the SQL from the LLM
    const sql = await generateSQL(question);

    // 2. SECURITY GUARDRAIL: Only allow SELECT queries
    if (!sql.trim().toUpperCase().startsWith("SELECT")) {
      return NextResponse.json(
        { error: "Only SELECT queries are allowed for security reasons." },
        { status: 403 }
      );
    }

    // 3. Run the safe query against Databricks
    const results = await runQuery(sql);

    // 4. Have the AI explain the JSON results in plain English
    const answer = await generateExplanation(question, results);

    // 5. Return the full payload to the frontend
    return NextResponse.json({
      sql,
      results,
      answer
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Query failed or database connection error" },
      { status: 500 }
    );
  }
}