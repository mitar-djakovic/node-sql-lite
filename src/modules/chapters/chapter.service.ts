import { CreateChapterDTO } from './chapter.validation';
import { prisma } from '../../lib/prisma';

export async function createChapter(data: CreateChapterDTO) {
	return prisma.chapter.create({ data });
}
