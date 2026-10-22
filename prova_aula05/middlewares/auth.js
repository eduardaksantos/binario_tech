const CHAVE_VALIDA = 'binario-tech-secret-2026';

function auth(req, res, next) {
  const chave = req.headers['x-api-key'];

  if (!chave || chave !== CHAVE_VALIDA) {
    return res.status(401).json({
      erro: "Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."
    });
  }

  next();
}

module.exports = auth;
