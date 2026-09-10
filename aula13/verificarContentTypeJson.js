function verificarContentTypeJson(req, res, next) {
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        erro: 'Content-Type inválido. Envie a requisição como application/json.'
      });
    }
  }

  next();
}

module.exports = verificarContentTypeJson;
