const Manutencao = require('../models/Manutencao');

const buscarPorPlaca = async (req, res) => {
  try {
    const { placa } = req.params;

    if (!placa) {
      return res.status(400).json({ erro: 'A placa é obrigatória para a busca.' });
    }

    const manutencoes = await Manutencao.find({
      placa: { $regex: placa, $options: 'i' }
    });

    if (manutencoes.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma manutenção encontrada para essa placa.' });
    }

    return res.status(200).json(manutencoes);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar manutenções.', detalhes: error.message });
  }
};

module.exports = { buscarPorPlaca };
