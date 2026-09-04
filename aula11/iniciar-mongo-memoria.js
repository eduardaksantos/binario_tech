const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  console.log('MongoDB em memória rodando em:', uri);

  // Atualiza o .env automaticamente
  const envContent = `MONGO_URI=${uri}binario_tech_nosql\nPORT=3000\n`;
  fs.writeFileSync('.env', envContent);

  console.log('.env atualizado! Agora rode "npm start" em outro terminal.');
  console.log('(deixe este processo rodando — ele mantém o banco vivo)');
})();
