const mongoose = require('mongoose');

async function conectarSenha() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Binário Tech] Conectado ao MongoDB com sucesso!');
  } catch (erro) {
    console.error('[Binário Tech] Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
}

module.exports = conectarSenha;
