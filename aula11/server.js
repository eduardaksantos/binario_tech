require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarBanco = require('./src/conf/database');
const alertaRoutes = require('./src/routes/alertaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/v1/alertas', alertaRoutes);

// Conectar ao Banco de Dados e iniciar servidor
conectarBanco(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`[Binário Tech] Servidor NoSQL ativo na porta ${PORT}`);
  });
});
