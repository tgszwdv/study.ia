// controllers/aiController.js
const aiService = require("../services/aiService");
const questionFormatter = require("../utils/questionFormatter");

// Obter explicação sobre um tópico
exports.getExplanation = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res
        .status(400)
        .json({ success: false, message: "O tópico é obrigatório" });
    }
    const explanation = await aiService.generateExplanation(topic);
    res.status(200).json({ success: true, explanation });
  } catch (error) {
    next(error);
  }
};

// Gerar questões sobre um tópico
exports.generateQuestions = async (req, res, next) => {
  try {
    const { topic, explanation } = req.body;
    if (!topic || !explanation) {
      return res.status(400).json({
        success: false,
        message: "O tópico e a explicação são obrigatórios",
      });
    }
    const rawQuestions = await aiService.generateQuestions(topic, explanation);
    const formattedQuestions = questionFormatter.formatQuestions(rawQuestions);
    res.status(200).json({ success: true, questions: formattedQuestions });
  } catch (error) {
    next(error);
  }
};

// Verificar respostas (opcional)
exports.checkAnswers = async (req, res, next) => {
  try {
    const { questions, userAnswers } = req.body;
    if (!questions || !userAnswers) {
      return res.status(400).json({
        success: false,
        message: "As questões e respostas do usuário são obrigatórias",
      });
    }

    // Calcular a pontuação
    let correct = 0;
    const total = questions.length;
    Object.keys(userAnswers).forEach((index) => {
      if (userAnswers[index] === questions[index].correctAnswerIndex) {
        correct++;
      }
    });
    const score = Math.round((correct / total) * 100);

    res.status(200).json({
      success: true,
      score,
      correct,
      total,
    });
  } catch (error) {
    next(error);
  }
};
