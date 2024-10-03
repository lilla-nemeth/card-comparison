import React from "react";
import styles from "@vuo/scss/components/atoms/Input.module.scss";
import { InputProps } from "@vuo/types/atomProps";

const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  placeholder,
  onChange,
}) => {
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
