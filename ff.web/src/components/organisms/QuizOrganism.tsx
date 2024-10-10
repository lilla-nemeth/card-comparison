import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../molecules/QuizQuestion';
import { QuizResult } from '../molecules/QuizResults';
import Button from "../atoms/Button";
import styles from './Quiz.module.scss';
import { mockQuizData } from '../../../public/static/mockQuizData';

export const QuizOrganism: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (answer: any) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (quizCompleted) {
    return <QuizResult quizData={mockQuizData} userAnswers={userAnswers} />;
  }

  const currentQuestion = mockQuizData.questions[currentQuestionIndex];

  return (
    <div className={styles.quizOrganism}>
      <h2 className={styles.quizTitle}>{mockQuizData.title}</h2>
      <QuizQuestion question={currentQuestion} onAnswer={handleAnswer} />
      <div className={styles.quizNavigation}>
        <Button 
          className="btn btn-secondary" 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button 
          className="btn btn-primary" 
          onClick={handleNext}
        >
          {currentQuestionIndex === mockQuizData.questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};