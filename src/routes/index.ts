import express from 'express';
import auth from './auth';
import helloWorld from './helloWorld';

const router = express.Router();

router.use('/', [auth, helloWorld]);

export default router;
