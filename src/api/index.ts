import express from 'express';

import chapterRouter from '../modules/chapters/chapter.router';
import courseRouter from '../modules/courses/course.router';
import lessonRouter from '../modules/lessons/lesson.router';
import userRouter from '../modules/users/user.router';

const router = express.Router();

router.use('/courses', courseRouter);
router.use('/chapters', chapterRouter);
router.use('/lessons', lessonRouter);
router.use('/users', userRouter);

export default router;
