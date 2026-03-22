export const DATABASE_SCHEMA = `
CATALOG: workspace
SCHEMA: urban_ai

TABLE: urban_ai.grocery_safety_index
USE FOR: questions about grocery stores, specific stores, stores in dangerous/safe areas
COLUMNS: store_name (string), city (string), zip_code (string), total_crimes (bigint), population (bigint), priority_score (double 0-100, higher = more dangerous)
NOTE: Multiple stores share the same zip_code — so total_crimes and population repeat per store. Each store row is unique. Do NOT aggregate unless comparing ZIPs.

TABLE: urban_ai.zip_crime_summary  
USE FOR: comparing ZIP codes by crime, crime density, crime rate questions
COLUMNS: zip_code (string), total_crimes (bigint), population (bigint)

TABLE: urban_ai.urban_safety_index
USE FOR: safest areas, safe corridors, transit safety, safety scores
COLUMNS: zip_code (string), city (string), safety_score (double 0-1, higher = safer), crime_index (double), population (bigint)

TABLE: urban_ai.urban_priority_index
USE FOR: highest priority areas, most dangerous ZIPs, risk ranking without stores
COLUMNS: zip_code (string), city (string), total_crimes (bigint), population (bigint), priority_score (double 0-100)

TABLE: urban_ai.svi_clean
USE FOR: poverty, unemployment, social vulnerability, uninsured, demographics, disability, no vehicle
KEY COLUMNS: LOCATION (string), COUNTY (string), E_TOTPOP (bigint), EP_POV150 (double % poverty), EP_UNEMP (double % unemployed), EP_UNINSUR (double % uninsured), EP_MINRTY (double % minority), EP_NOVEH (double % no vehicle), EP_DISABL (double % disabled), RPL_THEMES (double 0-1 overall vulnerability, higher = more vulnerable), RPL_THEME1 (socioeconomic), RPL_THEME2 (household), RPL_THEME3 (minority/language), RPL_THEME4 (housing/transport)

TABLE: urban_ai.snap_retailers
USE FOR: food access, food deserts, SNAP stores, authorized food retailers
COLUMNS: Record_ID (bigint), Store_Name (string), Store_Type (string), City (string), State (string), Zip_Code (bigint), County (string), Latitude (double), Longitude (double)
NOTE: Use backtick-quoted names if column has spaces: \`Store Name\`, \`Zip Code\` etc.

TABLE: urban_ai.census_clean
USE FOR: population data, income, housing, census demographics
COLUMNS: zip_code (string), population (bigint), median_income (double), poverty_rate (double)
`;