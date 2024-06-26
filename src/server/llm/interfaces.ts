import { z } from "zod";

export const ZRecipeIngredient = z.object({
  quantity: z.string(),
  measure: z.string(),
  ingredient: z.string(),
});
export type RecipeIngredient = z.infer<typeof ZRecipeIngredient>;
