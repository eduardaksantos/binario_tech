const mysql = require('mysql2');

function conectarBanco() {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('Conectado ao banco de dados MySQL!');
      resolve(connection);
    });
  });
}

module.exports = conectarBanco;
