const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
  equipamentoId: {
    type: String,
    required: [true, 'O ID do equipamento é obrigatório']
  },
  nivelSeveridade: {
    type: String,
    enum: ['BAIXO', 'MEDIO', 'CRITICO'],
    default: 'MEDIO'
  },
  temperaturaMedida: {
    type: Number,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  metadados: {
    type: Map,
    of: String
  },
  registradoEm: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alerta', alertaSchema);
