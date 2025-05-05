import express, { Request } from 'express';
import { z } from 'zod';

import { createCourse, getAllCourses } from './course.service';
import { CreateCourseDTO, createCourseSchema } from './course.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the course
 *         title:
 *           type: string
 *           description: The title of the course
 *         description:
 *           type: string
 *           description: A short description of the course
 *       required:
 *         - id
 *         - title
 *         - description
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction to Programming"
 *               description:
 *                 type: string
 *                 example: "A beginner course to learn programming"
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

// Need to find a solution for any
router.post('/', async (req: Request, res: any) => {
	console.log(req.body);
	try {
		// Validate and parse the request body using Zod schema
		const validatedData: CreateCourseDTO = createCourseSchema.parse(req.body);

		// If validation is successful, use the validated data in the service
		const { title, description } = validatedData;
		const newCourse = await createCourse({ title, description });

		// Return the newly created course as a response
		res.status(201).json(newCourse);
	} catch (err) {
		if (err instanceof z.ZodError) {
			// Handle validation error from Zod
			return res.status(400).json({
				message: 'Validation failed',
				errors: err.errors,
			});
		}

		// Handle other errors (like DB errors, etc.)
		console.error('Error creating course:', err);
		res.status(500).json({ message: 'Failed to create course' });
	}
});

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
	try {
		const courses = await getAllCourses();
		res.status(200).json(courses);
	} catch (err) {
		console.error('Error fetching courses:', err);
		res.status(500).json({ message: 'Failed to fetch courses' });
	}
});

export default router;
