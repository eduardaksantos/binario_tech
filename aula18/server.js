require('dotenv').config();
const express = require('express');
const cors = require('cors');
const autenticar = require('./src/middlewares/autenticar');
const authRoutes = require('./src/routes/authRoutes');
const provaRoutes = require('./src/routes/provaRoutes');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Rota Pública de Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.json({ status: "PRONTO_PARA_EXAME", timestamp: new Date() });
});

// Rota protegida
app.get('/api/v1/simulado/status', autenticar, (req, res) => {
  res.json({ mensagem: "Acesso autorizado no Servidor Local!", usuario: req.usuario });
});

// Rotas da prova (contém o POST /register)
app.use('/api/v1/prova', provaRoutes);

// Rotas de autenticação (JWT)
app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`[Binário Tech] Servidor ativo na porta ${PORT}`);
});
