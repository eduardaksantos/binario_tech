const express = require('express');
const router = express.Router();

// Armazenamento em memória (simples, para o exercício)
const manutencoes = [];
let proximoId = 1;

// GET /api/v1/manutencoes -> lista todos os orçamentos (aceita ?placa=ABC1D23)
router.get('/', (req, res) => {
  const { placa } = req.query;
  const resultado = placa
    ? manutencoes.filter(m => m.caminhaoPlaca.toLowerCase() === placa.toLowerCase())
    : manutencoes;

  res.status(200).json({ total: resultado.length, manutencoes: resultado });
});

// POST /api/v1/manutencoes -> cadastra um novo orçamento
router.post('/', (req, res) => {
  const { caminhaoPlaca, descricao, valorOrcamento } = req.body || {};

  if (!caminhaoPlaca || !descricao || valorOrcamento === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: caminhaoPlaca, descricao, valorOrcamento'
    });
  }

  if (typeof valorOrcamento !== 'number' || valorOrcamento < 0) {
    return res.status(400).json({ erro: 'valorOrcamento deve ser um número maior ou igual a 0' });
  }

  const nova = {
    id: proximoId++,
    caminhaoPlaca,
    descricao,
    valorOrcamento,
    status: 'pendente',
    criadoEm: new Date().toISOString()
  };

  manutencoes.push(nova);
  res.status(201).json(nova);
});

module.exports = router;
