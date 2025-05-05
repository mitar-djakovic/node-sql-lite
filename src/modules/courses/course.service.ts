import { PrismaClient } from '@prisma/client';

import { CreateCourseDTO } from './course.dto';

const prisma = new PrismaClient();

export const createCourse = async (data: CreateCourseDTO) => {
	return prisma.course.create({
		data,
	});
};
