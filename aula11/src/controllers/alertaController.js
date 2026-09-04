const Alerta = require('../models/Alerta');

const alertaController = {
  // Salvar novo documento BSON
  criarAlerta: async (req, res) => {
    try {
      const { equipamentoId, nivelSeveridade, temperaturaMedida, metadados, tags } = req.body;

      const novoAlerta = await Alerta.create({
        equipamentoId,
        nivelSeveridade,
        temperaturaMedida,
        metadados,
        tags
      });

      res.status(201).json(novoAlerta);
    } catch (erro) {
      res.status(400).json({ erro: "Erro ao salvar alerta no MongoDB", detalhe: erro.message });
    }
  },

  // Listar todos os alertas registrados
  listarAlertas: async (req, res) => {
    try {
      const alertas = await Alerta.find().sort({ registradoEm: -1 });
      res.status(200).json(alertas);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao consultar coleção no MongoDB" });
    }
  },

  // Buscar alertas por nível de severidade
  buscarPorSeveridade: async (req, res) => {
    try {
      const { nivel } = req.params;

      const NIVEIS_VALIDOS = ['BAIXO', 'MEDIO', 'CRITICO'];

      if (!NIVEIS_VALIDOS.includes(nivel)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: `Nível de severidade inválido. Use um dos seguintes: ${NIVEIS_VALIDOS.join(', ')}.`
        });
      }

      const alertas = await Alerta.find({ nivelSeveridade: nivel });

      if (!alertas || alertas.length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: `Nenhum alerta encontrado com o nível de severidade '${nivel}'.`
        });
      }

      return res.status(200).json({
        sucesso: true,
        total: alertas.length,
        dados: alertas
      });
    } catch (erro) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar alertas por severidade.',
        erro: erro.message
      });
    }
  }
};

module.exports = alertaController;
