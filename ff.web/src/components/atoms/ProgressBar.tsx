import React from "react";
import styles from "@vuo/scss/components/atoms/ProgressBar.module.scss";

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${value}%` }}></div>
    </div>
  );
};

export default ProgressBar;
