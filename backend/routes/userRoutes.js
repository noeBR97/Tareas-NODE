import { Router } from 'express';
import { validarJWT } from '../middlewares/validarJWT.js';
import { esAdmin } from '../middlewares/validarRoles.js';
export const router = Router();

router.use(validarJWT, esAdmin);

//router.get('/')