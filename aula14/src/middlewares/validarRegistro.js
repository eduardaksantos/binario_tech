const { body, validationResult } = require('express-validator');

const regrasRegistro = [
  body('email')
    .isEmail().withMessage('Email inválido.'),

  body('senha')
    .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
];

function validarRegistro(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      status: "ERRO",
      mensagens: erros.array().map(e => e.msg)
    });
  }
  next();
}

module.exports = { regrasRegistro, validarRegistro };
