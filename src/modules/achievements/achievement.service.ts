import { CreateAchievementDTO } from './achievement.validation';
import { prisma } from '../../lib/prisma';

export async function createAchievement(data: CreateAchievementDTO) {
	return prisma.achievement.create({
		data: {
			title: data.title,
			description: data.description,
			criteria: data.criteria,
		},
	});
}

export async function checkAndUnlockAchievements(userId: number) {
	const completedLessons = await prisma.lessonAttempt.count({
		where: {
			userId,
			completedAt: { not: null }, // Ensure we only get completed lessons
		},
	});

	const completedChapters = await prisma.lessonAttempt.findMany({
		where: { userId, completedAt: { not: null } },
		include: {
			lesson: {
				include: { chapter: true },
			},
		},
	});

	const uniqueChapters = new Set(completedChapters.map((la) => la.lesson.chapterId));

	// Achievement criteria
	const achievements = [
		{ title: 'Complete 5 lessons', criteria: { lessonsCompleted: 5 }, check: completedLessons >= 5 },
		{ title: 'Complete 25 lessons', criteria: { lessonsCompleted: 25 }, check: completedLessons >= 25 },
		{ title: 'Complete 50 lessons', criteria: { lessonsCompleted: 50 }, check: completedLessons >= 50 },
		{ title: 'Complete 1 chapter', criteria: { chaptersCompleted: 1 }, check: uniqueChapters.size >= 1 },
		{ title: 'Complete 5 chapters', criteria: { chaptersCompleted: 5 }, check: uniqueChapters.size >= 5 },
		{
			title: 'Complete the Swift course',
			criteria: { course: 'Swift' },
			check: await hasCompletedCourse(userId, 'Swift'),
		},
		{
			title: 'Complete the Javascript course',
			criteria: { course: 'JavaScript' },
			check: await hasCompletedCourse(userId, 'JavaScript'),
		},
		{
			title: 'Complete the C# course',
			criteria: { course: 'C#' },
			check: await hasCompletedCourse(userId, 'C#'),
		},
	];

	// Unlock achievements
	for (const achievement of achievements) {
		if (await achievement.check) {
			await unlockAchievement(userId, achievement.title);
		}
	}
}

// Function to check if a user has completed a course (by completing at least one lesson per chapter)
async function hasCompletedCourse(userId: number, courseTitle: string) {
	const course = await prisma.course.findUnique({
		where: { title: courseTitle },
		include: {
			chapters: {
				include: {
					lessons: {
						include: {
							LessonAttempt: {
								where: {
									userId,
									completedAt: { not: null },
								},
							},
						},
					},
				},
			},
		},
	});

	if (!course) {
		throw new Error(`Course with title "${courseTitle}" not found`);
	}

	// Check if the user has completed at least one lesson per chapter
	return course.chapters.every((chapter) =>
		chapter.lessons.some((lesson) =>
			lesson.LessonAttempt?.some((la) => la.userId === userId && la.completedAt !== null),
		),
	);
}

async function unlockAchievement(userId: number, achievementTitle: string) {
	const existingAchievement = await prisma.achievement.findFirst({
		where: { title: achievementTitle }, // ✅ title must be marked @unique in your schema
	});

	if (!existingAchievement) {
		throw new Error('Achievement not found');
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { achievements: true },
	});

	if (!user) {
		throw new Error('User not found');
	}

	const alreadyUnlocked = user.achievements.some((a) => a.id === existingAchievement.id);

	if (!alreadyUnlocked) {
		await prisma.user.update({
			where: { id: userId },
			data: {
				achievements: {
					connect: { id: existingAchievement.id }, // ✅ Connect by ID (safer and more common)
				},
			},
		});
	}
}

export async function getUserAchievements(userId: number) {
	return prisma.user.findUnique({
		where: { id: userId },
		include: {
			achievements: true, // This will include the achievements for this user
		},
	});
}
