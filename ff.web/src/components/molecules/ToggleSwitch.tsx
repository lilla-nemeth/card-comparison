import React from 'react';
import styles from './ToggleSwitch.module.scss';

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onCheckedChange }) => {
  const handleToggle = () => {
    onCheckedChange(!checked);
  };

  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={handleToggle} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ToggleSwitch;