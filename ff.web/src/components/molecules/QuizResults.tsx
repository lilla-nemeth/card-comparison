import React from 'react';
import styles from '../organisms/Quiz.module.scss';

interface QuizData {
  questions: Array<{
    correctAnswer: string | number;
  }>;
}

interface UserAnswer {
  answer: string | number;
}

interface QuizResultProps {
  quizData: QuizData;
  userAnswers: UserAnswer[];
}

export const QuizResult: React.FC<QuizResultProps> = ({ quizData, userAnswers }: QuizResultProps) => {
  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index]?.answer === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const totalQuestions = quizData.questions.length;
  return (
    <div className={styles.quizResult}>
      <h2>Quiz Results</h2>
      <p>You scored {score} out of {totalQuestions}</p>
      <p>Percentage: {((score / totalQuestions) * 100).toFixed(2)}%</p>
    </div>
  );
};