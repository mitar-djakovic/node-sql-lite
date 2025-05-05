import { prisma } from '../../../lib/prisma';

export const createLessonAttempt = async (userId: number, lessonId: number) => {
	return await prisma.lessonAttempt.create({
		data: {
			userId,
			lessonId,
			startedAt: new Date(),
		},
	});
};

export const completeLessonAttempt = async (userId: number, lessonId: number) => {
	return await prisma.lessonAttempt.updateMany({
		where: {
			userId,
			lessonId,
			completedAt: null,
		},
		data: {
			completedAt: new Date(),
		},
	});
};

export const getUserLessonAttempts = async (userId: number) => {
	return await prisma.lessonAttempt.findMany({
		where: {
			userId,
		},
		include: {
			lesson: true, // Optionally include lesson data
		},
	});
};
