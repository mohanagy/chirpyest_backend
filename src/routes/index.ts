import express from 'express';
import auth from './auth';
import helloWorld from './helloWorld';
import users from './users';

const router = express.Router();

router.use('/', [helloWorld]);
router.use('/api/v1/', [auth, users]);

export default router;
