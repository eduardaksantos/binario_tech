const express = require('express');
const router = express.Router();

const manutencoes = [];
let proximoId = 1;

router.get('/', (req, res) => {
  res.status(200).json(manutencoes);
});

router.post('/', (req, res) => {
  const { placa, descricao, valor } = req.body || {};

  if (!placa || !descricao || valor === undefined) {
    return res.status(400).json({
      erro: "Campos obrigatorios: 'placa', 'descricao' e 'valor'."
    });
  }

  const nova = { id: proximoId++, placa, descricao, valor };
  manutencoes.push(nova);
  res.status(201).json(nova);
});

module.exports = router;
