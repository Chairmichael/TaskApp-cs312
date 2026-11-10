import { Router } from 'express';
import * as tasks from '../controllers/TaskController.js';

const router = Router();

router.get('/', tasks.list);
router.post('/', tasks.create);
router.patch('/:id/status', tasks.updateStatus);
router.delete('/:id', tasks.remove);

export default router;