const express = require('express');
const router = express.Router();
const telemetriaController = require('../controllers/telemetriaController');

// Rota auxiliar: cadastra veículo de teste
router.post('/veiculo-teste', telemetriaController.cadastrarVeiculoTeste);

// Relatório completo, com filtro opcional de alerta (?alerta=true)
router.get('/relatorio', telemetriaController.listarRelatorioCompleto);

// Lista toda a telemetria (com JOIN)
router.get('/', telemetriaController.listarTudo);

// Busca telemetria de um veículo específico
router.get('/veiculo/:id', telemetriaController.buscarPorVeiculo);

module.exports = router;
