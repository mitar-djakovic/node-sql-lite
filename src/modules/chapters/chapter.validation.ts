import { z } from 'zod';

export const createChapterSchema = z.object({
	title: z.string().min(1),
	order: z.number().min(0),
	courseId: z.number().int(),
});

export type CreateChapterDTO = z.infer<typeof createChapterSchema>;
