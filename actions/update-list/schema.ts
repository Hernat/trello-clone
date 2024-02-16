import { z } from "zod";

export const UpdateList = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title must be a string",
		})
		.min(3, {
			message: "Minimum length of 3 letters is required",
		}),
	id: z.string(),
	boardId: z.string(),
});
