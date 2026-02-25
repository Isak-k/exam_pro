import { TFunction } from "i18next";

export interface ParsedQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface ParseResult {
  questions: ParsedQuestion[];
  errors: string[];
}

/**
 * Parses raw text containing multiple choice questions.
 * Supports flexible formats for question numbers and options.
 * 
 * @param text The raw text input
 * @param t Optional i18next TFunction for localized error messages
 * @returns Object containing parsed questions and any error messages
 */
export function parseQuestions(text: string, t?: TFunction): ParseResult {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const questions: ParsedQuestion[] = [];
  const errors: string[] = [];
  
  let currentQuestionText = "";
  let currentOptions: string[] = [];
  let currentCorrectIndex = -1;
  let currentExplanation = "";
  let questionCounter = 0;
  let answerLineFound = false;
  let explanationLineFound = false;

  // Regex patterns
  // Flexible Question Start: Matches "1.", "1)", "1-", "1 ", "Q1.", "Question 1:"
  // Also handles "1. " and "1." (if text immediately follows)
  const questionStartRegex = /^(?:Q|Question|Q\.)?\s*(\d+)[\.:\)\-\s]\s*(.+)/i;
  
  // Flexible Option Start: Matches "A.", "a)", "A-", "(A)", "A "
  // Captures the letter in group 1, and the text in group 2
  const optionRegex = /^\s*\(?([a-zA-Z])\)?[.:\)\-\s]\s*(.+)/;
  
  // Flexible Answer Line: Matches "Answer: A", "Ans - A", "Correct: A", "Answer A"
  const answerLineRegex = /^(?:Answer|Ans|Correct)\s*[:\-\s]\s*([a-zA-Z])/i;

  // Flexible Explanation Line: Matches "Explanation: ...", "Exp: ...", "Reason: ..."
  // Captures the explanation text in group 1
  const explanationLineRegex = /^(?:Explanation|Exp|Reason)\s*[:\-\s]\s*(.+)/i;

  const saveCurrentQuestion = () => {
    if (questionCounter > 0) {
      if (!currentQuestionText) {
        if (t) errors.push(t("admin.exams.bulkImport.errors.missingText", { n: questionCounter }));
        else errors.push(`Question ${questionCounter}: Missing question text.`);
      } else if (currentOptions.length < 2) {
        if (t) errors.push(t("admin.exams.bulkImport.errors.minOptions", { n: questionCounter }));
        else errors.push(`Question ${questionCounter}: Must have at least 2 options.`);
      } else if (currentCorrectIndex === -1) {
        if (t) errors.push(t("admin.exams.bulkImport.errors.noCorrect", { n: questionCounter }));
        else errors.push(`Question ${questionCounter}: No correct answer detected. Use '*' or 'Answer: X'.`);
      } else if (currentCorrectIndex >= currentOptions.length) {
        if (t) errors.push(t("admin.exams.bulkImport.errors.indexBounds", { n: questionCounter }));
        else errors.push(`Question ${questionCounter}: Correct answer index out of bounds.`);
      } else {
        // Remove quotes from explanation if present
        let cleanExplanation = currentExplanation.trim();
        if (cleanExplanation.startsWith('"') && cleanExplanation.endsWith('"')) {
          cleanExplanation = cleanExplanation.slice(1, -1);
        }

        questions.push({
          questionText: currentQuestionText,
          options: [...currentOptions],
          correctOptionIndex: currentCorrectIndex,
          explanation: cleanExplanation || undefined
        });
      }
    }
    // Reset
    currentQuestionText = "";
    currentOptions = [];
    currentCorrectIndex = -1;
    currentExplanation = "";
    answerLineFound = false;
    explanationLineFound = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for Question Start
    const questionMatch = line.match(questionStartRegex);
    if (questionMatch) {
      saveCurrentQuestion();
      questionCounter++;
      currentQuestionText = questionMatch[2].trim();
      continue;
    }

    // Check for Explanation Line
    const explanationMatch = line.match(explanationLineRegex);
    if (explanationMatch) {
      currentExplanation = explanationMatch[1].trim();
      explanationLineFound = true;
      continue;
    }

    // Check for Answer Line (e.g., "Answer: B")
    const answerMatch = line.match(answerLineRegex);
    if (answerMatch) {
      const answerChar = answerMatch[1].toUpperCase();
      const answerIndex = answerChar.charCodeAt(0) - 65; // 'A' -> 0
      currentCorrectIndex = answerIndex;
      answerLineFound = true;
      continue;
    }

    // Check for Option Line
    const optionMatch = line.match(optionRegex);
    if (optionMatch) {
      let optionText = optionMatch[2].trim();
      
      // Check for inline '*' indicating correct answer
      if (optionText.endsWith('*')) {
        optionText = optionText.slice(0, -1).trim();
        currentCorrectIndex = currentOptions.length;
      }

      currentOptions.push(optionText);
      continue;
    }

    // Fallback: Multiline handling
    if (questionCounter > 0) {
      if (explanationLineFound) {
        // Continuation of Explanation
        currentExplanation += " " + line;
      } else if (answerLineFound) {
        // Ignore lines after answer unless it's an explanation (handled above)
        // or a new question (handled above)
      } else if (currentOptions.length === 0) {
        // Continuation of Question Text
        currentQuestionText += " " + line;
      } else {
        // Continuation of Last Option (only if "Answer:" line not yet found)
        const lastIndex = currentOptions.length - 1;
        if (lastIndex >= 0) {
           currentOptions[lastIndex] += " " + line;
        }
      }
    }
  }

  // Save the last question
  saveCurrentQuestion();

  // Add a helpful error if nothing was found
  if (questions.length === 0 && errors.length === 0) {
    if (lines.length > 0) {
      errors.push("No questions detected. Please ensure your questions are numbered (e.g., '1. Question Text').");
    } else {
      errors.push("Input is empty.");
    }
  }

  return { questions, errors };
}
