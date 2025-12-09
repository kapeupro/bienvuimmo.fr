import { Router, Request, Response } from 'express';

const router = Router();

// CRUD basique pour les autres routes - À implémenter
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'List agencies - À implémenter' });
});

module.exports = router;
