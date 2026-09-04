exports.seed = async function(knex) {
  // Não apaga os dados existentes - apenas adiciona novos veículos

  const [v3] = await knex('veiculos').insert({ placa: 'MBZ-3030', montadora: 'Mercedes-Benz', modelo: 'Actros' });
  const [v4] = await knex('veiculos').insert({ placa: 'DAF-4040', montadora: 'DAF', modelo: 'XF 480' });

  // Insere leituras iniciais de telemetria para os novos veículos
  await knex('telemetria').insert([
    { veiculo_id: v3, velocidade: 78.0, temperatura_motor: 89.2 },
    { veiculo_id: v4, velocidade: 87.5, temperatura_motor: 91.4 }
  ]);
};
