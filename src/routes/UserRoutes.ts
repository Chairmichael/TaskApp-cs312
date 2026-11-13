import { Router } from 'express';
import * as users from '../controllers/UserController.js';

const router = Router();

router.post('/', users.auth);

export default router;