import React from "react";
import styles from "@vuo/scss/components/molecules/ToggleSwitch.module.scss";
import { ToggleSwitchProps } from "@vuo/types/moleculeProps";

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onCheckedChange,
}) => {
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
