import express from 'express';
import { supportValidation } from '../validations';
import { supportController } from '../controllers';
import { asyncHandler, validate } from '../middleware';

const router = express.Router();

router.post('/support', validate.body(supportValidation.contactUs), asyncHandler(supportController.contactUs));

export default router;
