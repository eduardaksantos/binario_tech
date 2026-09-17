const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  const partes = authHeader.split(' ');
  const token = partes.length === 2 ? partes[1] : partes[0];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
    req.usuario = decoded;
    next();
  });
}

module.exports = autenticar;
