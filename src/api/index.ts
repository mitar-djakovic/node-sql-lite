import express from 'express';

import achievementRouter from '../modules/achievements/achievement.router';
import chapterRouter from '../modules/chapters/chapter.router';
import courseRouter from '../modules/courses/course.router';
import lessonRouter from '../modules/lessons/lesson/lesson.router';
import lessonAttemptRouter from '../modules/lessons/lesson-attempt/lesson-attempt.router';
import userRouter from '../modules/users/user.router';

const router = express.Router();

router.use('/courses', courseRouter);
router.use('/chapters', chapterRouter);
router.use('/lessons', lessonRouter);
router.use('/users', userRouter);
router.use('/lesson-attempts', lessonAttemptRouter);
router.use('/achievements', achievementRouter);

export default router;
