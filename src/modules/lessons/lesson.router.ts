import express, { Request } from 'express';
import { z } from 'zod';

import { createLesson } from './lesson.service';
import { CreateLessonDTO, createLessonSchema } from './lesson.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         order:
 *           type: integer
 *         chapterId:
 *           type: integer
 *       required:
 *         - id
 *         - title
 *         - order
 *         - chapterId
 */

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               order:
 *                 type: integer
 *               chapterId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req: Request, res: any) => {
	try {
		const validatedData: CreateLessonDTO = createLessonSchema.parse(req.body);
		const lesson = await createLesson(validatedData);
		res.status(201).json(lesson);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation failed',
				errors: err.errors,
			});
		}

		console.error('Error creating lesson:', err);
		res.status(500).json({ message: 'Failed to create lesson' });
	}
});

export default router;
