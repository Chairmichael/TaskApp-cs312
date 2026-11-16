import { Router } from 'express';
import * as Users from '../controllers/UserController.js';

const router = Router();

router.get('/', (req, res) => req.session.userId ? res.redirect('/tasks') : res.redirect('/auth/login'));
router.get('/login', (_req, res) => res.redirect('/auth/login'));
router.get('/auth/login', Users.showLogin);
router.post('/auth/login', Users.login);
router.post('/auth/logout', Users.logout);
router.post('/auth/signup', Users.signup);

export default router;