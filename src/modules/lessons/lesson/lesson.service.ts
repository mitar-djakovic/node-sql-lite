import { CreateLessonDTO } from './lesson.validation';
import { prisma } from '../../../lib/prisma';

export async function createLesson(data: CreateLessonDTO) {
	return prisma.lesson.create({ data });
}
