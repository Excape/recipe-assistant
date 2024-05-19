"use server";
import { db } from "~/server/db";
import { generateShoppingList } from "~/server/llm/shopping-list";

export async function createShoppingList(formData: FormData) {
  const title = formData.get("title") as string;
  const recipeIds = formData.getAll("recipeIds[]") as string[];

  const ingredients = await db.query.recipeIngredients.findMany({
    where: (ingredient, { inArray }) =>
      inArray(ingredient.recipeId, recipeIds.map(Number)),
  });
  console.log("ingredients", ingredients);
  const shoppingList = await generateShoppingList(ingredients);
  console.log(shoppingList);
}
