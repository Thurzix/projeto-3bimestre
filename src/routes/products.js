import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// POST /products → cria um produto em uma loja
router.post('/', async (req, res) => {
  try {
    const { name, price, storeId } = req.body;
    if (!name || !price || !storeId) {
      return res.status(400).json({ error: 'Nome, preço e storeId são obrigatórios.' });
    }
    const product = await prisma.product.create({
      data: { name, price, storeId }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /products → lista todos os produtos incluindo a store e o user dono da loja
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        store: {
          include: { user: true }
        }
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /products/:id → atualiza nome e preço do produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    if (!name && !price) {
      return res.status(400).json({ error: 'Informe nome ou preço para atualizar.' });
    }
    const data = {};
    if (name) data.name = name;
    if (price) data.price = price;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /products/:id → remove um produto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
