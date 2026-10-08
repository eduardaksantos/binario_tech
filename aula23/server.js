const express = require('express');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CHAVE_CONTADOR = 'contador_visitas';

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

const redisClient = createClient({ url: REDIS_URL });
redisClient.on('error', (erro) => console.error('Erro no Redis:', erro));

// GET /api/v1/visitas -> incrementa e retorna o contador
app.get('/api/v1/visitas', async (req, res) => {
  try {
    const visitas = await redisClient.incr(CHAVE_CONTADOR);
    res.status(200).json({ visitas });
  } catch (erro) {
    console.error('Erro ao incrementar contador:', erro);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao registrar visita.' });
  }
});

// DELETE /api/v1/visitas/reset -> limpa a chave contador_visitas
app.delete('/api/v1/visitas/reset', async (req, res) => {
  try {
    const removidas = await redisClient.del(CHAVE_CONTADOR);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Contador de visitas resetado com sucesso.',
      chave: CHAVE_CONTADOR,
      chaves_removidas: removidas // 1 se existia, 0 se já não existia
    });
  } catch (erro) {
    console.error('Erro ao resetar contador:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao resetar o contador de visitas.'
    });
  }
});

async function iniciar() {
  await redisClient.connect();
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

iniciar().catch((erro) => {
  console.error('Falha ao iniciar o servidor:', erro);
  process.exit(1);
});
