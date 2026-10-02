const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

// Simulação de banco de dados em memória (compartilhado entre register e login)
const usuariosDB = [];

async function register(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Os campos "email" e "senha" são obrigatórios.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        error: 'A senha deve ter no mínimo 6 caracteres.'
      });
    }

    const usuarioExiste = usuariosDB.find(u => u.email === email);
    if (usuarioExiste) {
      return res.status(409).json({
        error: 'Este e-mail já está cadastrado.'
      });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const novoUsuario = {
      id: usuariosDB.length + 1,
      email,
      senha: senhaHash
    };
    usuariosDB.push(novoUsuario);

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: {
        id: novoUsuario.id,
        email: novoUsuario.email
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno ao processar o cadastro.'
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Os campos "email" e "senha" são obrigatórios.'
      });
    }

    const usuario = usuariosDB.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Token JWT contendo id e email, expira em 30 minutos
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({
      error: 'Erro interno ao processar o login.'
    });
  }
}

module.exports = { register, login, usuariosDB };
