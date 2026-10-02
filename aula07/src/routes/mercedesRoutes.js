// src/routes/mercedesRoutes.js
// Rotas para gerenciamento da frota de caminhões Mercedes-Benz (Actros e Atego)

const express = require("express");
const router = express.Router();

const mercedesController = require("../controllers/mercedesController");
const validaVin = require("../middlewares/validaVin");

// Lista toda a frota (aceita ?modelo=Actros ou ?modelo=Atego)
router.get("/", mercedesController.listarCaminhoes);

// Busca um caminhão específico pelo id
router.get("/:id", mercedesController.buscarCaminhaoPorId);

// Cadastra um novo caminhão na frota (valida o VIN antes)
router.post("/", validaVin, mercedesController.criarCaminhao);

// Atualiza os dados de um caminhão existente
router.put("/:id", mercedesController.atualizarCaminhao);

// Alterna a disponibilidade (disponível / indisponível) do caminhão
router.patch("/:id/disponibilidade", mercedesController.alternarDisponibilidade);

// Remove um caminhão da frota
router.delete("/:id", mercedesController.removerCaminhao);

module.exports = router;
