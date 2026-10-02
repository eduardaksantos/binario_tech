module.exports = {
  apps: [
    {
      name: 'aula19',
      script: './server.js', // <-- CERTIFIQUE-SE DE QUE ESTE CAMINHO EXISTE (ex: ./app.js, ./server.js ou ./src/index.js)
      
      env: {
        NODE_ENV: 'development',
        PORT: 3007
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3007
      }
    }
  ]
};
