const mongoose = require('mongoose');

async function conectarBanco(uri) {
  try {
    await mongoose.connect(uri);
    console.log('[Binário Tech] Conexão com MongoDB estabelecida com sucesso!');
  } catch (erro) {
    console.error(`[ERRO MONGODB]: Falha ao conectar ao banco - ${erro.message}`);
    process.exit(1);
  }
}

module.exports = conectarBanco;
