const express = require('express');
const router = express.Router();
const { buscarPorPlaca } = require('../controllers/manutencaoController');

router.get('/manutencoes/placa/:placa', buscarPorPlaca);

module.exports = router;
