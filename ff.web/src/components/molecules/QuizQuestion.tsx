import React, { useState } from 'react';
import Input from '../atoms/Input';
import styles from '../organisms/Quiz.module.scss';

interface QuizQuestionProps {
  question: {
    id: string;
    type: string;
    question: string;
    options?: string[];
    min?: number;
    max?: number;
  };
  onAnswer: (answer: any) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState<string | number>('');

  const handleAnswer = (value: string | number) => {
    setAnswer(value);
    onAnswer({ questionId: question.id, answer: value });
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'slider':
        return (
          <div className={styles.sliderContainer}>
            <input
              type="range"
              className={styles.sliderInput}
              min={question.min || 0}
              max={question.max || 30}
              value={answer as number}
              onChange={(e) => handleAnswer(Number(e.target.value))}
              aria-label={`Slider for ${question.question}`}
            />
            <div className={styles.sliderLabels}>
              <span>{question.min || 0}</span>
              <span>{question.max || 30}</span>
            </div>
            <div className={styles.sliderValue} aria-live="polite">{answer}</div>
          </div>
        );
      case 'single-choice':
      case 'multiple-choice':
        return (
          <div className={styles.optionsContainer} role="radiogroup" aria-labelledby={`question-${question.id}`}>
            {question.options?.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${answer === option ? styles.selected : ''}`}
                onClick={() => handleAnswer(option)}
                aria-checked={answer === option}
                role="radio"
              >
                {option}
              </button>
            ))}
          </div>
        );
      default:
        return (
          <Input 
            className={styles.textInput}
            onChange={(e) => handleAnswer(e.target.value)} 
            value={answer as string} 
            placeholder="Enter your answer"
            aria-labelledby={`question-${question.id}`}
          />
        );
    }
  };

  return (
    <div className={styles.quizQuestion}>
      <h3> id={`question-${question.id}`}>{question.question}</h3>
      {renderQuestionInput()}
    </div>
  );
};