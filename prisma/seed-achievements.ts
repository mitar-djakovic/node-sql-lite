import { CreateAchievementDTO } from '../src/modules/achievements/achievement.validation';
import { prisma } from '../src/lib/prisma';

async function seedAchievements() {
	const achievements: CreateAchievementDTO[] = [
		{
			title: 'Complete 5 lessons',
			description: 'Complete 5 lessons to earn this achievement',
			criteria: { lessonsCompleted: 5 },
		},
		{
			title: 'Complete 25 lessons',
			description: 'Complete 25 lessons to earn this achievement',
			criteria: { lessonsCompleted: 25 },
		},
		{
			title: 'Complete 50 lessons',
			description: 'Complete 50 lessons to earn this achievement',
			criteria: { lessonsCompleted: 50 },
		},
		{
			title: 'Complete 1 chapter',
			description: 'Complete at least 1 chapter to earn this achievement',
			criteria: { chaptersCompleted: 1 },
		},
		{
			title: 'Complete 5 chapters',
			description: 'Complete at least 5 chapters to earn this achievement',
			criteria: { chaptersCompleted: 5 },
		},
		{
			title: 'Complete the Swift course',
			description: 'Complete the Swift course to earn this achievement',
			criteria: { course: 'Swift' },
		},
		{
			title: 'Complete the JavaScript course',
			description: 'Complete the JavaScript course to earn this achievement',
			criteria: { course: 'JavaScript' },
		},
		{
			title: 'Complete the C# course',
			description: 'Complete the C# course to earn this achievement',
			criteria: { course: 'C#' },
		},
	];

	for (const achievement of achievements) {
		await prisma.achievement.create({
			data: achievement,
		});
		console.log(`Achievement "${achievement.title}" created.`);
	}
}

seedAchievements()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
