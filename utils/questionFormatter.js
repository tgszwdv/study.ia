/**
 * Formata um array de objetos de perguntas para garantir consistência
 * @param {Array} rawQuestions - Array de objetos com perguntas, opções, resposta correta e explicação
 * @return {Array} Array de objetos de questão formatados
 */
exports.formatQuestions = (rawQuestions) => {
  if (!Array.isArray(rawQuestions)) {
    throw new Error(
      "Formato inválido de perguntas. Esperado array de objetos."
    );
  }

  return rawQuestions.map((q, index) => {
    // Garantir que as opções sejam um array de 4 itens
    const options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];

    while (options.length < 4) {
      options.push(`Opção ${options.length + 1}`);
    }

    // Garantir índice de resposta correta
    const correctAnswerIndex =
      typeof q.correctAnswerIndex === "number" &&
      q.correctAnswerIndex >= 0 &&
      q.correctAnswerIndex < options.length
        ? q.correctAnswerIndex
        : 0;

    // Criar explicação padrão se não existir
    const explanation =
      q.explanation?.trim() ||
      `A resposta correta é a opção ${String.fromCharCode(
        65 + correctAnswerIndex
      )}.`;

    return {
      id: index + 1,
      question: q.question?.trim() || "Pergunta não fornecida",
      options,
      correctAnswerIndex,
      explanation,
    };
  });
};
