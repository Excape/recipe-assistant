"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { recipeIngredients, recipes } from "~/server/db/schema";
import { parseRecipe } from "~/server/llm/recipe-parser";

export interface ScanRecipeFormState {
  message: string;
}

export async function scanRecipeAction(
  prevState: ScanRecipeFormState,
  formData: FormData,
): Promise<ScanRecipeFormState> {
  const title = formData.get("title") as string;
  const pictureFile = formData.get("picture") as File;
  let ingredients;
  try {
    ingredients = await parseRecipe(pictureFile);
  } catch (error) {
    return { message: `Failed to parse recipe: ${String(error)}` };
  }

  const newRecipe = (
    await db.insert(recipes).values({ title }).returning({ id: recipes.id })
  )[0];
  if (!newRecipe) {
    throw new Error("Failed to insert recipe");
  }
  await db.insert(recipeIngredients).values(
    ingredients.map((ingredient) => ({
      name: ingredient.ingredient,
      measure: ingredient.measure,
      quantity: ingredient.quantity,
      recipeId: newRecipe.id,
    })),
  );
  revalidatePath("/");
  return { message: "Recipe added successfully" };
}
