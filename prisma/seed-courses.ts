import { randomInt } from 'crypto';
import { prisma } from '../src/lib/prisma';

async function seedCourses() {
	const coursesData = [{ title: 'Swift' }, { title: 'JavaScript' }, { title: 'C#' }];

	for (const courseData of coursesData) {
		// Create the course
		const course = await prisma.course.create({
			data: {
				title: courseData.title,
			},
		});

		// Generate random chapters (1-10 chapters)
		const numChapters = randomInt(1, 11); // Random number between 1 and 10
		for (let i = 0; i < numChapters; i++) {
			const chapter = await prisma.chapter.create({
				data: {
					title: `${course.title} Chapter ${i + 1}`,
					order: i + 1,
					courseId: course.id,
				},
			});

			// Generate random lessons (1-10 lessons per chapter)
			const numLessons = randomInt(1, 11); // Random number between 1 and 10
			for (let j = 0; j < numLessons; j++) {
				await prisma.lesson.create({
					data: {
						title: `${course.title} Chapter ${i + 1} Lesson ${j + 1}`,
						chapterId: chapter.id,
						order: j + 1,
					},
				});
			}
		}

		console.log(`Seeded course: ${course.title} with ${numChapters} chapters and lessons.`);
	}
}

seedCourses()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
