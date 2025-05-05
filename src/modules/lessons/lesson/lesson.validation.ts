import { z } from 'zod';

export const createLessonSchema = z.object({
	title: z.string().min(1),
	content: z.string().optional(),
	order: z.number().min(0),
	chapterId: z.number().int(),
});

export type CreateLessonDTO = z.infer<typeof createLessonSchema>;
