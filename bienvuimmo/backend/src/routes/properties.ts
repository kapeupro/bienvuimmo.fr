import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/properties - Liste des biens
router.get('/', async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        agency: true,
        agent: true,
        photos: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id - Détail d'un bien
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        agency: true,
        agent: true,
        photos: true,
        documents: true,
        mandate: true,
        visits: true,
      },
    });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST /api/properties - Créer un bien
router.post('/', async (req: Request, res: Response) => {
  res.json({ message: 'Create property - À implémenter' });
});

// PUT /api/properties/:id - Modifier un bien
router.put('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'Update property - À implémenter' });
});

// DELETE /api/properties/:id - Supprimer un bien
router.delete('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'Delete property - À implémenter' });
});

module.exports = router;
