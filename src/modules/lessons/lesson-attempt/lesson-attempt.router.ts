import express, { Request } from 'express';
import { z } from 'zod';

import { completeLessonAttempt, createLessonAttempt, getUserLessonAttempts } from './lesson-attempt.service';
import { completeLessonAttemptSchema, createLessonAttemptSchema } from './lesson-attempt.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LessonAttempt:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         lessonId:
 *           type: integer
 *         startedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - userId
 *         - lessonId
 *         - startedAt
 */

/**
 * @swagger
 * /lesson-attempts:
 *   post:
 *     summary: Start a new lesson attempt for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               lessonId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lesson attempt started successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req: Request, res: any) => {
	try {
		const validatedData = createLessonAttemptSchema.parse(req.body);
		const { userId, lessonId } = validatedData;
		const attempt = await createLessonAttempt(userId, lessonId);
		res.status(201).json(attempt);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation failed',
				errors: err.errors,
			});
		}
		console.error('Error creating lesson attempt:', err);
		res.status(500).json({ message: 'Failed to start lesson attempt' });
	}
});

/**
 * @swagger
 * /lesson-attempts/complete:
 *   post:
 *     summary: Mark a lesson attempt as completed for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               lessonId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lesson attempt completed successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.post('/complete', async (req: Request, res: any) => {
	try {
		const validatedData = completeLessonAttemptSchema.parse(req.body);
		const { userId, lessonId } = validatedData;
		await completeLessonAttempt(userId, lessonId);
		res.status(200).json({ message: 'Lesson attempt marked as completed' });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation failed',
				errors: err.errors,
			});
		}
		console.error('Error completing lesson attempt:', err);
		res.status(500).json({ message: 'Failed to complete lesson attempt' });
	}
});

/**
 * @swagger
 * /lesson-attempts/user/{userId}:
 *   get:
 *     summary: Get all lesson attempts for a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to fetch attempts for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of lesson attempts
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', async (req: Request, res: any) => {
	const userId = parseInt(req.params.userId);
	try {
		const attempts = await getUserLessonAttempts(userId);
		res.status(200).json(attempts);
	} catch (err) {
		console.error('Error fetching lesson attempts:', err);
		res.status(500).json({ message: 'Failed to fetch lesson attempts' });
	}
});

export default router;
