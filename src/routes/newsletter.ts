import express from 'express';
import { newsletterValidation } from '../validations';
import { newsletterController } from '../controllers';
import { asyncHandler, validate } from '../middleware';

const router = express.Router();

router.post(
  '/newsletter',
  validate.body(newsletterValidation.subscribeToNewsLetterValidation),
  asyncHandler(newsletterController.subscribeToNewsLetter),
);

export default router;
