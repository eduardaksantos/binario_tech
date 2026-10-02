const mongoose = require('mongoose');

const itemPecaSchema = new mongoose.Schema({
  nomePeca: { type: String, required: true },
  quantidade: { type: Number, required: true, default: 1 },
  custoUnitario: { type: Number, required: true, min: [0, 'custoUnitario não pode ser negativo.'] }
});

const manutencaoSchema = new mongoose.Schema({
  veiculoPlaca: { type: String, required: true, upperCase: true },
  tipoManutencao: {
    type: String,
    enum: ['PREVENTIVA', 'CORRETIVA', 'EMERGENCIAL'],
    default: 'PREVENTIVA'
  },
  custoTotal: { type: Number, required: true },
  pecasSubstituidas: [itemPecaSchema],
  status: { type: String, enum: ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA'], default: 'ABERTA' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Manutencao', manutencaoSchema);
