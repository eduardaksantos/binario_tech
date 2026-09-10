function autorizarPerfil(perfisPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ status: "ERRO", mensagem: "Usuário não autenticado." });
    }

    if (!perfisPermitidos.includes(usuario.perfil)) {
      return res.status(403).json({
        status: "ERRO",
        mensagem: `Acesso negado. Perfil '${usuario.perfil}' não tem permissão para este recurso.`
      });
    }

    next();
  };
}

module.exports = autorizarPerfil;
