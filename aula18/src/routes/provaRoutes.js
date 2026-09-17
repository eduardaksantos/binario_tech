const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/registerController');
const validarJWT = require('../middlewares/validarJWT');

router.post('/register', register);
router.post('/login', login);

router.get('/relatorio', validarJWT, (req, res) => {
  res.status(200).json({
    message: 'Acesso autorizado ao relatório.',
    usuario: req.usuario
  });
});

module.exports = router;
