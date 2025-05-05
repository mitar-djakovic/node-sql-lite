import { CreateCourseDTO } from './course.validation';
import { prisma } from '../../lib/prisma';

export const createCourse = async (data: CreateCourseDTO) => {
	return prisma.course.create({
		data,
	});
};

export const getAllCourses = async () => {
	return prisma.course.findMany({
		include: {
			chapters: {
				include: {
					lessons: true,
				},
			},
		},
	});
};
