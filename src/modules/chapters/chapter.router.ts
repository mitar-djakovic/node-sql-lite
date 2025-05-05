import express, { Request } from 'express';
import { z } from 'zod';

import { createChapter } from './chapter.service';
import { CreateChapterDTO, createChapterSchema } from './chapter.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         order:
 *           type: integer
 *         courseId:
 *           type: integer
 *       required:
 *         - id
 *         - title
 *         - order
 *         - courseId
 */

/**
 * @swagger
 * /chapters:
 *   post:
 *     summary: Create a new chapter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               order:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req: Request, res: any) => {
	try {
		const validatedData: CreateChapterDTO = createChapterSchema.parse(req.body);
		const chapter = await createChapter(validatedData);
		res.status(201).json(chapter);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation failed',
				errors: err.errors,
			});
		}

		console.error('Error creating chapter:', err);
		res.status(500).json({ message: 'Failed to create chapter' });
	}
});

export default router;
