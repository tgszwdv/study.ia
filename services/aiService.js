// /services/aiService.js
const axios = require("axios");
require("dotenv").config();

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_URL = process.env.AI_API_URL || "https://api.openai.com/v1";
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

// Configuração do cliente axios
const aiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${AI_API_KEY}`, // Importante para autenticação
  },
});

// Função para gerar explicação sobre um tópico
exports.generateExplanation = async (topic) => {
  try {
    const response = await aiClient.post("/chat/completions", {
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente educacional especializado em criar explicações claras e concisas sobre diversos tópicos. Suas explicações devem ser informativas e adequadas para estudantes.",
        },
        {
          role: "user",
          content: `Crie uma explicação educativa sobre o tópico: ${topic}. A explicação deve ser abrangente, mas concisa, com aproximadamente 3-5 parágrafos.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "Erro ao gerar explicação:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao gerar explicação com a API de IA");
  }
};

// Função para gerar questões baseadas na explicação
exports.generateQuestions = async (topic, explanation) => {
  try {
    const response = await aiClient.post("/chat/completions", {
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `
Você é um assistente educacional especializado em criar questões de múltipla escolha.

Gere 5 questões sobre o tópico fornecido com base na explicação abaixo.

Responda exclusivamente no formato JSON (sem comentários ou texto fora do JSON). Cada objeto do array deve conter:

- question: string
- options: array de 4 strings (as alternativas)
- correctAnswerIndex: número (0-3)
- explanation: string explicando por que a alternativa está correta
          `.trim(),
        },
        {
          role: "user",
          content: `Tópico: ${topic}\n\nExplicação: ${explanation}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    let content = response.data.choices[0].message.content.trim();

    // 🧼 Remove blocos de código markdown como ```json ... ```
    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?\n?/, "").replace(/```$/, "");
    }

    const questions = JSON.parse(content);
    return questions;
  } catch (error) {
    console.error(
      "Erro ao gerar questões:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao gerar questões com a API de IA");
  }
};
