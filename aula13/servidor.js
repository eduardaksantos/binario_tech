const express = require('express');
const { validationResult } = require('express-validator');
const regrasCadastroVeiculo = require('./regrasCadastroVeiculo');
const verificarContentTypeJson = require('./verificarContentTypeJson');

const app = express();

app.use(verificarContentTypeJson); // middleware customizado, antes do parser
app.use(express.json());

app.post('/teste', regrasCadastroVeiculo, (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() });
  res.json({
    placaRecebida: req.body.placa,
    anoFabricacaoRecebido: req.body.anoFabricacao
  });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
