import express, { Request } from 'express';
import { z } from 'zod';

import { createUser } from './user.service';
import { CreateUserDTO, createUserSchema } from './user.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - email
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req: Request, res: any) => {
	try {
		const validatedData: CreateUserDTO = createUserSchema.parse(req.body);
		const newUser = await createUser(validatedData);
		res.status(201).json(newUser);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ message: 'Validation failed', errors: err.errors });
		}

		console.error('Error creating user:', err);
		res.status(500).json({ message: 'Failed to create user' });
	}
});

export default router;
