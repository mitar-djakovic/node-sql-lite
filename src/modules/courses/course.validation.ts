import { z } from 'zod';

export const createCourseSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters long'),
	description: z.string().optional(),
});

export type CreateCourseDTO = z.infer<typeof createCourseSchema>;
