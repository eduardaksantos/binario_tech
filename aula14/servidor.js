const express = require('express');
const { validationResult } = require('express-validator');
const regrasCadastroVeiculo = require('./regrasCadastroVeiculo');
const verificarContentTypeJson = require('./verificarContentTypeJson');
const { autenticarToken } = require('./autenticarToken');
const autorizarPerfil = require('./autorizarPerfil');

const app = express();

app.use(verificarContentTypeJson);
app.use(express.json());

app.post('/teste', regrasCadastroVeiculo, (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() });
  res.json({
    placaRecebida: req.body.placa,
    anoFabricacaoRecebido: req.body.anoFabricacao
  });
});

// Rota protegida: só ADMIN pode acessar
app.delete('/veiculos/:id',
  autenticarToken,
  autorizarPerfil(['ADMIN']),
  (req, res) => {
    res.json({ mensagem: `Veículo ${req.params.id} removido com sucesso.` });
  }
);

app.listen(3007, () => console.log('Servidor rodando na porta 3007'));
