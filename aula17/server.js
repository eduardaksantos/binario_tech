require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const conectarBanco = require('./src/config/database');
const autenticar = require('./src/middlewares/autenticar');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Rota Pública de Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.json({ status: "PRONTO_PARA_EXAME", timestamp: new Date() });
});

// Rota para gerar um token JWT de teste (válido por 5 minutos)
app.post('/api/v1/auth/token-teste', (req, res) => {
  const payload = { usuario: 'teste_simulado', role: 'aluno' };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
  res.json({ token });
});

// Rota Protegida do Simulado
app.get('/api/v1/simulado/status', autenticar, (req, res) => {
  res.json({ mensagem: "Acesso autorizado no Servidor Local!", usuario: req.usuario });
});

conectarBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`[Binário Tech] Servidor da Aula 17 ativo na porta ${PORT}`);
  });
});
