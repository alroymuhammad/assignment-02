import { db } from "../../utils/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateJobSchema } from "./schema";
import { queue } from "../../worker/queue";

export const jobRouter = new Hono()
	.get("/", async (c) => {
		const jobs = await db.orm.public.Job.all();
		return c.json({ jobs: jobs });
	})
	.get("/:id", (c) => {
		const { id } = c.req.param();
		return c.json({ message: `Hello job with ${id}` });
	})
	.post("/", zValidator("json", CreateJobSchema), async (c) => {
		const body = c.req.valid("json");

		const newJob = await db.orm.public.Job.create({
			destination: body.destination,
			budget: body.budget,
			status: "PENDING",
		});

		await queue.add("generate-destination", newJob);

		return c.json({ job: newJob }, 202);
	});
