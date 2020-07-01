import express from 'express';
import { authControllers } from '../controllers';
import validator from '../middleware/validate';
import { authValidation } from '../validations';

const router = express.Router();

router.post('/auth/signup', validator.body(authValidation.signUpValidation), authControllers.signUp);

export default router;
