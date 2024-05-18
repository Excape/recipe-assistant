import { desc } from "drizzle-orm";
import { db } from ".";
import { recipes, type recipeIngredients } from "./schema";

export interface RecipeWithIngredient {
  id: number;
  title: string;
  ingredients: (typeof recipeIngredients.$inferSelect)[];
}

export async function getAllRecipes(): Promise<RecipeWithIngredient[]> {
  return await db.query.recipes.findMany({
    orderBy: [desc(recipes.id)],
    with: { ingredients: true },
    columns: { id: true, title: true },
  });
}
