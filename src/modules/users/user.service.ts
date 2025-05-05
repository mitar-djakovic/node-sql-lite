import { CreateUserDTO } from './user.validation';
import { prisma } from '../../lib/prisma';

export const createUser = async (data: CreateUserDTO) => {
	return prisma.user.create({ data });
};
