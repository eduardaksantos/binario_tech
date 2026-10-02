const Manutencao = require('../models/Manutencao');

const manutencaoController = {
  // EXERCÍCIO 1: busca parcial case-insensitive por placa
  buscarPorPlaca: async (req, res) => {
    try {
      const { placa } = req.params;

      if (!placa) {
        return res.status(400).json({ erro: 'Informe a placa para realizar a busca.' });
      }

      const resultados = await Manutencao.find({
        veiculoPlaca: { $regex: placa, $options: 'i' }
      });

      if (resultados.length === 0) {
        return res.status(404).json({ erro: 'Nenhuma manutenção encontrada para essa placa.' });
      }

      res.status(200).json(resultados);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar manutenções por placa.', detalhe: erro.message });
    }
  },

  // Criar Registro com Subdocumentos
  criar: async (req, res) => {
    try {
      const novaManutencao = await Manutencao.create(req.body);
      res.status(201).json(novaManutencao);
    } catch (erro) {
      res.status(400).json({ erro: "Erro ao registrar manutenção", detalhe: erro.message });
    }
  },

  // Listar com Filtro Avançado ($gte / $lte em Custo)
  listarComFiltros: async (req, res) => {
    try {
      const { minCusto, status } = req.query;
      let query = {};

      if (minCusto) {
        query.custoTotal = { $gte: Number(minCusto) };
      }
      if (status) {
        query.status = status;
      }

      const resultados = await Manutencao.find(query).sort({ createdAt: -1 });
      res.status(200).json(resultados);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao consultar manutenções." });
    }
  },

  // Atualizar Status por ID
  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const atualizado = await Manutencao.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!atualizado) {
        return res.status(404).json({ erro: "Registro de manutenção não encontrado." });
      }

      res.status(200).json(atualizado);
    } catch (erro) {
      res.status(400).json({ erro: "Erro ao atualizar registro.", detalhe: erro.message });
    }
  },

  // Deletar Registro por ID
  excluir: async (req, res) => {
    try {
      const { id } = req.params;
      const removido = await Manutencao.findByIdAndDelete(id);

      if (!removido) {
        return res.status(404).json({ erro: "Registro não encontrado para exclusão." });
      }

      res.status(200).json({ mensagem: "Registro de manutenção excluído com sucesso!" });
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao excluir registro." });
    }
  },

  // EXERCÍCIO 2: adicionar peça a uma manutenção existente
  adicionarPeca: async (req, res) => {
    try {
      const { id } = req.params;
      const { nomePeca, quantidade, custoUnitario } = req.body;

      if (!nomePeca || !quantidade || !custoUnitario) {
        return res.status(400).json({ erro: "Informe nomePeca, quantidade e custoUnitario." });
      }

      const atualizado = await Manutencao.findByIdAndUpdate(
        id,
        { $push: { pecasSubstituidas: { nomePeca, quantidade, custoUnitario } } },
        { new: true, runValidators: true }
      );

      if (!atualizado) {
        return res.status(404).json({ erro: "Registro de manutenção não encontrado." });
      }

      res.status(200).json(atualizado);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao adicionar peça.", detalhe: erro.message });
    }
  }
};

module.exports = manutencaoController;

