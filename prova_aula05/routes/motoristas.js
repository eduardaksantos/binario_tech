const express = require('express');
const router = express.Router();
const validaCnh = require('../middlewares/validaCnh');

const motoristas = [];

router.get('/', (req, res) => {
  res.status(200).json(motoristas);
});

router.post('/', validaCnh, (req, res) => {
  const { nome, cnh, categoria } = req.body;

  if (!nome || !cnh || !categoria) {
    return res.status(400).json({ erro: "Campos obrigatorios: nome, cnh e categoria." });
  }

  const novo = { id: motoristas.length + 1, nome, cnh, categoria, ativo: true };
  motoristas.push(novo);
  res.status(201).json(novo);
});

module.exports = router;
