import { Router } from 'express';
import { login, signup } from '../controllers/auth';
import validate from '../middlewares/validation';
import { userValidationRules, loginValidationRules } from '../utils/validation';

const router = Router();

router.post('/signup', userValidationRules(), validate, signup);
router.post('/login', loginValidationRules(), validate, login);

export default router;