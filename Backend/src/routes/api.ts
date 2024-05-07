import express from 'express';
import authRouter from './auth';
import codexRouter from './codex';
import tarotRouter from './tarot';
import spamRouter from './spam';
import majoRouter from './majo';
import versionRouter from './version';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/codex', codexRouter);
router.use('/tarot', tarotRouter);
router.use('/spam', spamRouter);
router.use('/majo', majoRouter);
router.use('/version', versionRouter);

export default router;
