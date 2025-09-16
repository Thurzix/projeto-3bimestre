import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// POST /stores → cria uma loja para um usuário
router.post('/', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Nome e userId são obrigatórios.' });
    }
    const store = await prisma.store.create({
      data: { name, userId }
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /stores/:id → retorna a loja pelo id incluindo o user e os products
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id: Number(id) },
      include: { user: true, products: true }
    });
    if (!store) return res.status(404).json({ error: 'Loja não encontrada.' });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /stores/:id → atualiza o nome da loja
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });
    const store = await prisma.store.update({
      where: { id: Number(id) },
      data: { name }
    });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /stores/:id → remove a loja
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.store.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
