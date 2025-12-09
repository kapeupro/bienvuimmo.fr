import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  res.json({ message: 'Register endpoint - À implémenter' });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  res.json({ message: 'Login endpoint - À implémenter' });
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  res.json({ message: 'Logout endpoint - À implémenter' });
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  res.json({ message: 'Get current user - À implémenter' });
});

module.exports = router;
