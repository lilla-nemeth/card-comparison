import React from 'react';
import { Button as AntDButton } from 'antd-mobile';
import styles from './Button.module.scss'; // Import SCSS module

interface CustomButtonProps {
  color?: 'primary' | 'secondary'  // Custom variants
  variant?: 'large' | 'heavy' | 'medium' | 'small';  // Custom sizes
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({ 
  variant = 'large', // Default variant
  color = 'primary', // Default color
  onClick, 
  children 
}) => {

  const buttonClass = `${styles[variant]} ${styles[color]}`; // Use SCSS module

  return (
    <AntDButton className={buttonClass} onClick={onClick}>
      {children}
    </AntDButton>
  );
};

export default Button;

// import { Button } from "antd-mobile";
// export default Button;
