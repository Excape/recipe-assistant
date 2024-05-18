import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "~/env";
import { z } from "zod";
import { type RecipeIngredient, ZRecipeIngredient } from "./interfaces";

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

const chatModel = new ChatOpenAI({
  model: env.OPENAI_MODEL,
}).withStructuredOutput(
  z.object({
    ingredients: z.array(ZRecipeIngredient),
  }),
  { method: "jsonMode" },
);
const base64ImageMessage = new HumanMessage({
  content: [
    {
      type: "image_url",
      image_url: { url: "data:image/png;base64,{base64Image}", detail: "high" },
    },
  ],
});
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Provided a picture of a recipe, you will extract the ingredients from it and produce a JSON object with the key "ingredients" containing a list of objects the following fields:
    - "quantity" (string) - the quantity of the ingredient, e.g. "1", "1/2", "500". Ignore any auxiliary information about it
    - "measure" (string) - the measure of the ingredient, e.g. "cup", "tbs", "can". Ignore any auxiliary information about it
    - "ingredient" (string) - the ingredient like it would appear on a shopping list. Ignore any indication of how to prepare an ingredient, like "chopped" or "diced".
    `,
  ],
  base64ImageMessage,
]);

const llmChain = prompt.pipe(chatModel);

export async function parseRecipe(picture: File): Promise<RecipeIngredient[]> {
  console.log("file", picture);
  const type = picture.type;
  const pictureData = await fileToBase64(picture);
  const imageUrl = `data:${type};base64,${pictureData}`;
  console.log("imageUrl", imageUrl.slice(0, 20));

  const response = await llmChain.invoke({ base64Image: pictureData });
  return response.ingredients;
}
