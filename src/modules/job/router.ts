import { db } from "../../utils/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateJobSchema } from "./schema";
import { queue } from "../../worker/queue";

export const jobRouter = new Hono()
    .get("/", async (c) => {
        const recipeJobs = await db.orm.public.RecipeJob.all();
        return c.json({ recipeJobs });
    })
    .get("/:id", async (c) => {
        const { id } = c.req.param();

        const recipeList = await db.orm.public.RecipeResult.where((recipe) =>
            recipe.recipeJobId.eq(id),
        ).all();

        return c.json({ recipeJobId: id, recipeList });
    })
    .post("/", zValidator("json", CreateJobSchema), async (c) => {
        const body = c.req.valid("json");

        const recipeJob = await db.orm.public.RecipeJob.create({
            ingredients: body.ingredients,
            goal: body.goal,
            status: "PENDING",
        });

        await queue.add("generate-recipe", recipeJob);

        return c.json({ recipeJob }, 202);
    });
