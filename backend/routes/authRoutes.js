import { Router } from 'express';
export const router = Router();

import {login, registro} from '../controllers/authController.js';

router.post('/login', login);
router.post('/registro', registro);