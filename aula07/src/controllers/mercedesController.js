// src/controllers/mercedesController.js
// Controller responsável por gerenciar a frota de caminhões
// Mercedes-Benz (modelos Actros e Atego)

// "Banco de dados" em memória, apenas para fins didáticos
let frota = [
  {
    id: 1,
    modelo: "Actros",
    placa: "ABC1D23",
    ano: 2022,
    capacidadeCargaTon: 25,
    quilometragem: 45000,
    disponivel: true,
  },
  {
    id: 2,
    modelo: "Atego",
    placa: "XYZ9K87",
    ano: 2020,
    capacidadeCargaTon: 12,
    quilometragem: 98000,
    disponivel: false,
  },
];

let proximoId = 3;

const MODELOS_VALIDOS = ["Actros", "Atego"];

// Função utilitária para validar o corpo da requisição
function validarCaminhao(dados) {
  const erros = [];

  if (!dados.modelo || !MODELOS_VALIDOS.includes(dados.modelo)) {
    erros.push(`O campo 'modelo' é obrigatório e deve ser um dos: ${MODELOS_VALIDOS.join(", ")}.`);
  }

  if (!dados.placa || typeof dados.placa !== "string") {
    erros.push("O campo 'placa' é obrigatório e deve ser uma string.");
  }

  if (dados.ano !== undefined && typeof dados.ano !== "number") {
    erros.push("O campo 'ano' deve ser um número.");
  }

  if (dados.capacidadeCargaTon !== undefined && typeof dados.capacidadeCargaTon !== "number") {
    erros.push("O campo 'capacidadeCargaTon' deve ser um número.");
  }

  if (dados.quilometragem !== undefined && typeof dados.quilometragem !== "number") {
    erros.push("O campo 'quilometragem' deve ser um número.");
  }

  return erros;
}

// GET /mercedes -> lista toda a frota (com filtro opcional por modelo)
function listarCaminhoes(req, res) {
  const { modelo } = req.query;

  let resultado = frota;

  if (modelo) {
    if (!MODELOS_VALIDOS.includes(modelo)) {
      return res.status(400).json({
        erro: `Modelo inválido. Use um dos: ${MODELOS_VALIDOS.join(", ")}.`,
      });
    }
    resultado = frota.filter((caminhao) => caminhao.modelo === modelo);
  }

  return res.status(200).json(resultado);
}

// GET /mercedes/:id -> busca um caminhão específico
function buscarCaminhaoPorId(req, res) {
  const id = Number(req.params.id);
  const caminhao = frota.find((c) => c.id === id);

  if (!caminhao) {
    return res.status(404).json({ erro: "Caminhão não encontrado." });
  }

  return res.status(200).json(caminhao);
}

// POST /mercedes -> cadastra um novo caminhão na frota
function criarCaminhao(req, res) {
  const dados = req.body;
  const erros = validarCaminhao(dados);

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const novoCaminhao = {
    id: proximoId++,
    modelo: dados.modelo,
    placa: dados.placa,
    ano: dados.ano ?? null,
    capacidadeCargaTon: dados.capacidadeCargaTon ?? null,
    quilometragem: dados.quilometragem ?? 0,
    disponivel: dados.disponivel ?? true,
  };

  frota.push(novoCaminhao);

  return res.status(201).json(novoCaminhao);
}

// PUT /mercedes/:id -> atualiza os dados de um caminhão existente
function atualizarCaminhao(req, res) {
  const id = Number(req.params.id);
  const index = frota.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Caminhão não encontrado." });
  }

  const dados = { ...frota[index], ...req.body };
  const erros = validarCaminhao(dados);

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  frota[index] = { ...dados, id };

  return res.status(200).json(frota[index]);
}

// DELETE /mercedes/:id -> remove um caminhão da frota
function removerCaminhao(req, res) {
  const id = Number(req.params.id);
  const index = frota.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Caminhão não encontrado." });
  }

  const [removido] = frota.splice(index, 1);

  return res.status(200).json({
    mensagem: "Caminhão removido com sucesso.",
    caminhao: removido,
  });
}

// PATCH /mercedes/:id/disponibilidade -> alterna a disponibilidade do caminhão
function alternarDisponibilidade(req, res) {
  const id = Number(req.params.id);
  const caminhao = frota.find((c) => c.id === id);

  if (!caminhao) {
    return res.status(404).json({ erro: "Caminhão não encontrado." });
  }

  caminhao.disponivel = !caminhao.disponivel;

  return res.status(200).json(caminhao);
}

module.exports = {
  listarCaminhoes,
  buscarCaminhaoPorId,
  criarCaminhao,
  atualizarCaminhao,
  removerCaminhao,
  alternarDisponibilidade,
};
