"use client";
import { useOptimistic } from "react";
import type { RecipeWithIngredient } from "~/server/db/recipes";
import { AddRecipeForm } from "./add-recipe-form";
import {
  type ScanRecipeFormState,
  scanRecipeAction,
} from "../actions/scan-recipe";
import { SubmitButton } from "./submit-button";
import { createShoppingList } from "../actions/create-meal-plan";

type OptimisticRecipe = RecipeWithIngredient & { isPending?: boolean };

export function RecipeList({ allRecipes }: { allRecipes: OptimisticRecipe[] }) {
  const [optimisticRecipes, addOptimisticRecipe] = useOptimistic(
    allRecipes,
    (state, recipeTitle: string) => [
      {
        title: recipeTitle,
        id: state.length + 1,
        ingredients: [],
        isPending: true,
      },
      ...state,
    ],
  );

  const onSubmit = async (
    prevState: ScanRecipeFormState,
    formData: FormData,
  ) => {
    const title = formData.get("title") as string;
    addOptimisticRecipe(title);
    return await scanRecipeAction(prevState, formData);
  };

  return (
    <>
      <AddRecipeForm formAction={onSubmit} />
      <form
        action={createShoppingList}
        className="container flex flex-col items-center justify-center gap-4 px-4 py-16 "
      >
        <input
          type="text"
          name="title"
          placeholder="Meal Plan Title"
          className="rounded border border-gray-400 p-2"
          required
        />
        <SubmitButton label="Create Meal Plan" />

        {optimisticRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex w-full flex-row gap-2 border-b border-gray-200"
          >
            <input
              type="checkbox"
              name={"recipeIds[]"}
              value={recipe.id}
              className="h-4 w-4"
            />
            <details>
              <summary>{recipe.title}</summary>
              {recipe.isPending && <p>Adding recipe...</p>}
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <span className="bg-blue-300">{ingredient.quantity}</span>{" "}
                    <span className="bg-red-300">{ingredient.measure}</span>{" "}
                    <span className="bg-green-300">{ingredient.name}</span>{" "}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </form>
    </>
  );
}
