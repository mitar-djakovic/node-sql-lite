import { z } from 'zod';

export const createAchievementSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	criteria: z
		.object({
			lessonsCompleted: z.number().optional(),
			chaptersCompleted: z.number().optional(),
			course: z.string().optional(),
		})
		.refine(
			(data) => {
				// Ensure at least one criterion is defined
				return Object.values(data).some((val) => val !== undefined);
			},
			{
				message: 'At least one criteria should be defined',
			},
		),
});

export type CreateAchievementDTO = z.infer<typeof createAchievementSchema>;
