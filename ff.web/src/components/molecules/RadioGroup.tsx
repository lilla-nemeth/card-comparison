import React from 'react';
import styles from './RadioGroup.module.scss';

interface RadioGroupProps {
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange }) => {
  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioLabel}>
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className={styles.radioInput}
          />
          <span className={styles.radioText}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;