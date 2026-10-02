const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');

router.post('/', manutencaoController.criar);
router.get('/', manutencaoController.listarComFiltros);
router.get('/placa/:placa', manutencaoController.buscarPorPlaca); // EXERCÍCIO 1
router.patch('/:id/status', manutencaoController.atualizarStatus);
router.delete('/:id', manutencaoController.excluir);
router.post('/:id/pecas', manutencaoController.adicionarPeca); // EXERCÍCIO 2
module.exports = router;
