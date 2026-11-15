import { Router } from 'express';

const router = Router();

// FIXME: This should probably be in its own file, but it's
// literally one statement so it should be sufficient for now.
router.get('/', (req, res) => res.render('index', {}));

export default router;