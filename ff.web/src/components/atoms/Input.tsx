import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type = 'text', value, placeholder, onChange }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={styles.input}
    />
  );
};

export default Input;