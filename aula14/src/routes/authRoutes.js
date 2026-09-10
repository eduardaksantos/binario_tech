const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticarToken = require('../middlewares/autenticarToken');
const autorizarPerfil = require('../middlewares/autorizarPerfil');
const { regrasRegistro, validarRegistro } = require('../middlewares/validarRegistro');

// Rotas públicas
router.post('/register', regrasRegistro, validarRegistro, authController.registrar);
router.post('/login', authController.login);

// Rota privada (exige Token JWT)
router.get('/perfil', autenticarToken, authController.perfil);

// Rota privada, exige Token JWT + perfil ADMIN
router.get('/admin-only', autenticarToken, autorizarPerfil(['ADMIN']), (req, res) => {
  res.status(200).json({
    status: "AUTORIZADO",
    mensagem: "Acesso concedido à área administrativa!",
    usuario: req.usuario
  });
});

module.exports = router;
