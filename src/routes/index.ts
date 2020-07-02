import express from 'express';
import auth from './auth';
import helloWorld from './helloWorld';

const router = express.Router();

router.use('/', [helloWorld]);
router.use('/api/v1/', [auth]);

export default router;
