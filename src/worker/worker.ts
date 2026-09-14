import { Worker } from "bullmq";
import { QUEUE_NAME, workerConnection } from "./config";
import { db } from "../utils/db";
import { generateRecipeList } from "../modules/job/service";

export const worker = new Worker(
	QUEUE_NAME,
	async (job) => {
		console.log(`Processing job: ${job.data.id}`);

		const jobId = job.data.id;
		if (!jobId) {
			throw new Error("Job ID is missing");
		}

		const recipeJob = await db.orm.public.RecipeJob.where((job) =>
			job.id.eq(jobId),
		).first();
		console.log(recipeJob);

		if (!recipeJob) {
			throw new Error(`Recipe job with ID ${jobId} not found`);
		}

		const { recipeList } = await generateRecipeList(
			recipeJob.ingredients,
			recipeJob.goal,
		);

		console.log("Recipes generated successfully");
		console.log(recipeList);

		await db.orm.public.RecipeResult.createAll(
			recipeList.map((recipe) => ({ ...recipe, recipeJobId: recipeJob.id })),
		);
		await db.orm.public.RecipeJob.where((job) => job.id.eq(jobId)).update({
			status: "COMPLETED",
		});
	},
	{
		connection: workerConnection,
	},
);
