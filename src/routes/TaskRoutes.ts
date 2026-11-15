import { Router } from 'express';
import type { RequestHandler } from 'express';
import * as tasks from '../controllers/TaskController.js';


const requireLogin: RequestHandler = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
        return;
    }
    next();
};

const router = Router();

router.use(requireLogin);
router.get('/', tasks.list);
router.post('/', tasks.create);
router.patch('/:id/status', tasks.updateStatus);
router.delete('/:id', tasks.remove);

export default router;