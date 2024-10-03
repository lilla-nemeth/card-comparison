import React from "react";
import { Button as AntDButton } from "antd-mobile";
import styles from "@vuo/scss/components/atoms/Button.module.scss"; // Import SCSS module
import { CustomButtonProps } from "@vuo/types/atomProps";

const Button: React.FC<CustomButtonProps> = ({
  variant = "large", // Default variant
  color = "primary", // Default color
  onClick,
  children,
}) => {
  const buttonClass = `${styles[variant]} ${styles[color]}`; // Use SCSS module

  return (
    <AntDButton className={buttonClass} onClick={onClick}>
      {children}
    </AntDButton>
  );
};

export default Button;
