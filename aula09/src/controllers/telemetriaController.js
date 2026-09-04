const db = require('../database/connection');

// Cadastra um veículo de teste (usado pelo script de auditoria)
exports.cadastrarVeiculoTeste = async (req, res, next) => {
  try {
    const { placa, montadora, modelo } = req.body;

    if (!placa || !montadora || !modelo) {
      return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' são obrigatórios." });
    }

    const [id] = await db('veiculos').insert({ placa, montadora, modelo });
    const veiculo = await db('veiculos').where({ id }).first();

    return res.status(201).json(veiculo);
  } catch (err) {
    next(err);
  }
};

// Retorna todas as leituras de telemetria, com dados do veículo (JOIN)
exports.listarTudo = async (req, res, next) => {
  try {
    const registros = await db('telemetria')
      .join('veiculos', 'telemetria.veiculo_id', 'veiculos.id')
      .select(
        'telemetria.id',
        'veiculos.placa',
        'veiculos.montadora',
        'veiculos.modelo',
        'telemetria.velocidade',
        'telemetria.capturado_em'
      );

    return res.json(registros);
  } catch (err) {
    next(err);
  }
};

// Retorna apenas as leituras de telemetria de um veículo específico
exports.buscarPorVeiculo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const veiculo = await db('veiculos').where({ id }).first();

    if (!veiculo) {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }

    const registros = await db('telemetria')
      .join('veiculos', 'telemetria.veiculo_id', 'veiculos.id')
      .where('telemetria.veiculo_id', id)
      .select(
        'telemetria.id',
        'veiculos.placa',
        'veiculos.montadora',
        'veiculos.modelo',
        'telemetria.velocidade',
        'telemetria.capturado_em'
      );

    return res.json(registros);
  } catch (err) {
    next(err);
  }
};

// Relatório completo, com filtro opcional por alerta de temperatura (?alerta=true)
exports.listarRelatorioCompleto = async (req, res, next) => {
  try {
    const { alerta } = req.query;

    let query = db('telemetria')
      .join('veiculos', 'telemetria.veiculo_id', 'veiculos.id')
      .select(
        'telemetria.id',
        'veiculos.placa',
        'veiculos.montadora',
        'veiculos.modelo',
        'telemetria.velocidade',
        'telemetria.temperatura_motor',
        'telemetria.capturado_em'
      );

    if (alerta === 'true') {
      query = query.where('telemetria.temperatura_motor', '>', 95);
    }

    const registros = await query;
    return res.json(registros);
  } catch (err) {
    next(err);
  }
};
