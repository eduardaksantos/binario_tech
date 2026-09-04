function tratarErros(err, req, res, next) {
  console.error(`[ERRO LOG]: ${err.message}`);

  if (err instanceof SyntaxError) {
    return res.status(400).json({ erro: "JSON inválido: verifique a sintaxe do corpo da requisição." });
  }

  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({ erro: "Conflito de dados: Registro já existe com este valor único (ex: Placa)." });
  }

  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(400).json({ erro: "Erro de relacionamento: O registro pai fornecido não existe." });
  }

  return res.status(500).json({ erro: "Erro interno no servidor da Binário Tech." });
}

module.exports = tratarErros;
