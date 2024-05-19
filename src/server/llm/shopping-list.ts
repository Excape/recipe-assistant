import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "process";
import { z } from "zod";
import { type RecipeIngredient } from "../db/recipes";

const chatModel = new ChatOpenAI({
  model: env.OPENAI_MODEL,
}).withStructuredOutput(
  z.object({
    shoppingList: z.array(z.object({ quantity: z.string(), item: z.string() })),
  }),
  { method: "jsonMode" },
);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are provided a list of ingredients from multiple cooking recipes. 
    Your task is to produce a shopping list that contains all the ingredients, combining any duplicates and adding their quantities together. 
    The shopping list should be a JSON object with the key "shoppingList" containing a list of objects with the following fields:
    - "quantity" (string) - the quantity of the ingredient, e.g. "1 can", "1/2 bundle", "500 grams". Ignore any auxiliary information about it
    - "item" (string) - The grocery item like it would appear on a shopping list.
    `,
  ],
  ["human", "{content}"],
]);

const llmChain = prompt.pipe(chatModel);

export async function generateShoppingList(ingredients: RecipeIngredient[]) {
  const ingredientList = ingredients
    .map(
      (ingredient) =>
        `- ${ingredient.quantity} ${ingredient.measure} ${ingredient.name}`,
    )
    .join("\n");
  console.log("prompt", ingredientList);
  const response = await llmChain.invoke({ content: ingredientList });
  return response.shoppingList;
}
