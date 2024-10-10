// Define QuizData type here
interface QuizData {
  // Define the structure of QuizData here
  // For example:
  // questions: Array<{
  //   question: string;
  //   answers: string[];
  //   correctAnswer: number;
  // }>;
}

export const mockQuizData: QuizData = {
  id: 'food-quiz-001',
  title: 'Delicious Food Quiz',
  questions: [
    {
      id: 'q1',
      type: 'slider',
      question: 'How many minutes does it typically take to cook spaghetti?',
      correctAnswer: 10,
    },
    {
      id: 'q2',
      type: 'single-choice',
      question: 'Which cuisine is sushi from?',
      options: ['Chinese', 'Japanese', 'Korean', 'Thai'],
      correctAnswer: 'Japanese',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'Which of the following are types of pasta?',
      options: ['Penne', 'Fusilli', 'Ravioli', 'Risotto'],
      correctAnswer: ['Penne', 'Fusilli', 'Ravioli'],
    },
    {
      id: 'q4',
      type: 'text-input',
      question: 'What is the main ingredient in guacamole?',
      correctAnswer: 'Avocado',
    },
  ],
};