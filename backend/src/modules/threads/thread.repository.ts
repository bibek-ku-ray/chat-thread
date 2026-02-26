import { query } from "../../db/db";
import { mapCategoryRow, type Category, type CategoryRow } from "./thread.types";

export async function listCategories(): Promise<Category[]> {
  const result = await query<CategoryRow>(
    `
      SELECT id, slug, name, description
      FROM categories
      ORDER BY name ASC
    `
  )
  return result.rows.map(mapCategoryRow)
} 