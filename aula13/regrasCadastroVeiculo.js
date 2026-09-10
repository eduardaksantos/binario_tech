const { body } = require('express-validator');

const anoAtual = new Date().getFullYear();

const regrasCadastroVeiculo = [
  body('placa')
    .notEmpty().withMessage('A placa é obrigatória')
    .trim()
    .toUpperCase(),

  body('anoFabricacao')
    .optional()
    .isInt({ min: 2000, max: anoAtual })
    .withMessage(`O ano de fabricação deve ser um número inteiro entre 2000 e ${anoAtual}`)
    .toInt(),
];

module.exports = regrasCadastroVeiculo;
