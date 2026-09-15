import z from "zod";
import { generateCompletion } from "@anvia/core";
import { getModel } from "../../llm/models";

const RecipeSchema = z.object({
    name: z.string(),
    description: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
    estimatedCaloriesPerServing: z.number().int(),
});

const RecipeListSchema = z.object({
    recipeList: z.array(RecipeSchema).max(3),
});

const SYSTEM_INSTRUCTIONS =
    "You are an Indonesian cooking expert. Generate up to 3 recipes as JSON.";

export async function generateRecipeList(ingredients: string, goal: string) {
    console.log(`Generating recipes for: ${ingredients}`);

    const prompt = `Generate Indonesian recipes using these ingredients: ${ingredients}.
The recipes should satisfy this goal: ${goal}.`;

    const res = await generateCompletion({
        model: getModel(),
        prompt,
        instructions: SYSTEM_INSTRUCTIONS,
        outputSchema: RecipeListSchema,
    });

    console.log("Generating done!");

    return res.output;
}
