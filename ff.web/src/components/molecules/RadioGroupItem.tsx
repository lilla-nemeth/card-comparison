import React from 'react';
import styles from './RadioGroupItem.module.scss';

interface RadioGroupItemProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, label, checked, onChange }) => {
  return (
    <label className={styles.radioLabel}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={styles.radioInput}
      />
      <span className={styles.radioText}>{label}</span>
    </label>
  );
};

export default RadioGroupItem;