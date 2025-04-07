// routes/aiRoutes.js
const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

// Rota para obter explicação sobre um tópico
router.post("/explanation", aiController.getExplanation);

// Rota para gerar questões sobre um tópico
router.post("/questions", aiController.generateQuestions);

// Rota para verificar respostas (opcional)
router.post("/check-answers", aiController.checkAnswers);

module.exports = router;
