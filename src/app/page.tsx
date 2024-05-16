import { db } from "~/server/db";
import { recipeIngredients, recipes } from "~/server/db/schema";
import { NewRecipeForm } from "./components/new-recipe";
import { revalidatePath } from "next/cache";
import { test } from "~/server/llm/playground";
import { parseRecipe } from "~/server/llm/recipe-parser";

export default async function HomePage() {
  const allRecipes = await db.query.recipes.findMany({
    with: { ingredients: true },
  });

  async function addRecipe(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const pictureFile = formData.get("picture") as File;
    const ingredients = await parseRecipe(pictureFile);

    const newRecipe = (
      await db.insert(recipes).values({ title }).returning({ id: recipes.id })
    )[0];
    if (!newRecipe) {
      throw new Error("Failed to insert recipe");
    }
    await db.insert(recipeIngredients).values(
      ingredients.map((ingredient) => ({
        name: ingredient.ingredient,
        quantity: ingredient.quantity,
        recipeId: newRecipe.id,
      })),
    );
    revalidatePath("/");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        Hello World
        {allRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex w-full flex-col gap-2 border-b border-gray-200"
          >
            <h2>{recipe.title}</h2>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.quantity} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <NewRecipeForm action={addRecipe} />
      </div>
    </main>
  );
}
