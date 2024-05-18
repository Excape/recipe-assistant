import { getAllRecipes } from "~/server/db/recipes";
import { RecipeList } from "./components/recipe-list";

export default async function HomePage() {
  const allRecipes = await getAllRecipes();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <RecipeList allRecipes={allRecipes} />
      </div>
    </main>
  );
}
