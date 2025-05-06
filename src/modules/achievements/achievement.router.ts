import express, { Request, Response } from 'express';
import { z } from 'zod';

import { checkAndUnlockAchievements, createAchievement, getUserAchievements } from './achievement.service';
import { CreateAchievementDTO, createAchievementSchema } from './achievement.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         criteria:
 *           type: object
 *           properties:
 *             lessonsCompleted:
 *               type: integer
 *             chaptersCompleted:
 *               type: integer
 *             course:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - title
 */

/**
 * @swagger
 * /achievements:
 *   post:
 *     summary: Create a new achievement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               criteria:
 *                 type: object
 *                 properties:
 *                   lessonsCompleted:
 *                     type: integer
 *                   chaptersCompleted:
 *                     type: integer
 *                   course:
 *                     type: string
 *     responses:
 *       201:
 *         description: Achievement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req: Request, res: any) => {
	try {
		const validatedData: CreateAchievementDTO = createAchievementSchema.parse(req.body);
		const achievement = await createAchievement(validatedData);
		res.status(201).json(achievement);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation failed',
				errors: err.errors,
			});
		}

		console.error('Error creating achievement:', err);
		res.status(500).json({ message: 'Failed to create achievement' });
	}
});

/**
 * @swagger
 * /achievements/check/{userId}:
 *   get:
 *     summary: Check and unlock achievements for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to check achievements for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Achievements checked and unlocked if applicable
 *       400:
 *         description: Invalid userId parameter
 *       500:
 *         description: Internal server error
 */

router.get('/check/:userId', async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.userId, 10);
		await checkAndUnlockAchievements(userId);
		res.status(200).json({ message: 'Achievements checked and unlocked if applicable' });
	} catch (err) {
		console.error('Error checking achievements:', err);
		res.status(500).json({ message: 'Failed to check achievements' });
	}
});

/**
 * @swagger
 * /achievements/{userId}:
 *   get:
 *     summary: Get the achievements unlocked by a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get('/:userId', async (req: Request, res: any) => {
	const { userId } = req.params;

	try {
		const userWithAchievements = await getUserAchievements(Number(userId));

		if (!userWithAchievements) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json(userWithAchievements.achievements);
	} catch (err) {
		console.error('Error checking achievements:', err);
		res.status(500).json({ message: 'Failed to fetch achievements' });
	}
});

export default router;
