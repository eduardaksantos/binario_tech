const jwt = require('jsonwebtoken');

const SEGREDO = 'segredo-teste-123'; // em produção isso vem de variável de ambiente

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  jwt.verify(token, SEGREDO, (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
    req.usuario = usuario;
    next();
  });
}

module.exports = { autenticarToken, SEGREDO };
