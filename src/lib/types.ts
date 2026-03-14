export type AskRequest = {
  question: string;
};

export type SQLQuery = {
  sql: string;
};

export type GroceryResult = {
  store_name: string;
  city: string;
  zip_code: string;
  total_crimes: number;
  population: number;
  priority_score: number;
};

export type AskResponse = {
  answer: string;
  sql: string;
  results: GroceryResult[];
};