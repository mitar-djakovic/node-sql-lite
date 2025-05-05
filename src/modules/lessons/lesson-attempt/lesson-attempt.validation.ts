import { z } from 'zod';

export const createLessonAttemptSchema = z.object({
	userId: z.number().min(1, 'User ID is required'),
	lessonId: z.number().min(1, 'Lesson ID is required'),
});

export const completeLessonAttemptSchema = z.object({
	userId: z.number().min(1, 'User ID is required'),
	lessonId: z.number().min(1, 'Lesson ID is required'),
});

export type CreateLessonAttemptDTO = z.infer<typeof createLessonAttemptSchema>;
export type CompleteLessonAttemptDTO = z.infer<typeof completeLessonAttemptSchema>;
