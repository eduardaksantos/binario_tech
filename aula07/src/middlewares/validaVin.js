// src/middlewares/validaVin.js
// Middleware exclusivo de validação de Chassi/VIN.
// Garante que o campo 'vin' enviado no corpo da requisição (POST)
// possua exatamente 12 caracteres.

const TAMANHO_VIN = 12;

function validaVin(req, res, next) {
  const { vin } = req.body;

  if (!vin || typeof vin !== "string") {
    return res.status(400).json({
      erro: "O campo 'vin' é obrigatório e deve ser uma string.",
    });
  }

  if (vin.length !== TAMANHO_VIN) {
    return res.status(400).json({
      erro: `O VIN informado é inválido. Ele deve conter exatamente ${TAMANHO_VIN} caracteres (recebido: ${vin.length}).`,
    });
  }

  next();
}

module.exports = validaVin;
