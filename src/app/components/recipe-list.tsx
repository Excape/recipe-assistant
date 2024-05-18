"use client";
import { useOptimistic } from "react";
import type { RecipeWithIngredient } from "~/server/db/recipes";
import { AddRecipeForm } from "./add-recipe-form";
import {
  type ScanRecipeFormState,
  scanRecipeAction,
} from "../actions/scan-recipe";

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
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <AddRecipeForm formAction={onSubmit} />
      {optimisticRecipes.map((recipe) => (
        <div
          key={recipe.id}
          className="flex w-full flex-col gap-2 border-b border-gray-200"
        >
          <h2>{recipe.title}</h2>
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
        </div>
      ))}
    </div>
  );
}
