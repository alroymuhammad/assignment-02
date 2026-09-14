import z from "zod";

export const CreateJobSchema = z.object({
    ingredients: z.array(z.string()).min(1),
    goal: z.string().max(255),
});
