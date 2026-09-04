const express = require('express');
const router = express.Router();

let manutencoes = [
    { id: 1, veiculo: "Caminhão Volvo FH", descricao: "Troca de óleo e filtros", valor: 850.00, status: "concluida" },
    { id: 2, veiculo: "Caminhão Scania R450", descricao: "Revisão de freios", valor: 1200.50, status: "pendente" }
];

// GET /api/v1/manutencoes
router.get('/', (req, res) => {
    res.status(200).json(manutencoes);
});

// POST /api/v1/manutencoes (Com validacao inline)
router.post('/', (req, res) => {
    const { veiculo, descricao, valor, status } = req.body;

    if (!veiculo || !descricao || !valor) {
        return res.status(400).json({ erro: "Campos 'veiculo', 'descricao' e 'valor' sao obrigatorios." });
    }

    const novaManutencao = {
        id: manutencoes.length + 1,
        veiculo,
        descricao,
        valor,
        status: status || "pendente"
    };

    manutencoes.push(novaManutencao);
    res.status(201).json(novaManutencao);
});

module.exports = router;
