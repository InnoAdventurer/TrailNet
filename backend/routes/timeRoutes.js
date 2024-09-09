// backend/routes/timeRoutes.js

import { Router } from 'express';

const router = Router();

router.get('/current', (req, res) => {
    const currentTime = new Date();
    res.json({ currentTime });
});

export default router;
