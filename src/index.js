// Importar as bibliotecas necessárias
import express from "express";
import dotenv from "dotenv";
import storesRoutes from "./routes/stores.js";
import productsRoutes from "./routes/products.js";
import prisma from "./db.js"; // Importar nossa conexão com o banco

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware para processar JSON nas requisições
app.use(express.json());

// Rotas de stores e products
app.use("/stores", storesRoutes);
app.use("/products", productsRoutes);

//Healthcheck
app.get("/", (_req, res) => res.json({ ok: true, service: "API 3º Bimestre" }));

//CREATE: POST /usuarios
app.post("/usuarios", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const novoUsuario = await prisma.user.create({
      data: { name, email, password }
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error); // Mostra o erro detalhado no terminal
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

//READ: GET /usuarios
app.get("/usuarios", async (_req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      orderBy: { id: "asc" }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});


//UPDATE: PUT /usuarios/:id
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const usuarioAtualizado = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, password }
    });
    res.json(usuarioAtualizado);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

//DELETE: DELETE /usuarios/:id
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover usuário" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//ROTA DE TESTE
app.get("/status", (req, res) => {
  res.json({ message: "API Online" });
});
