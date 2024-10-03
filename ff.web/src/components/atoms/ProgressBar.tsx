import React from "react";
import styles from "@vuo/scss/components/atoms/ProgressBar.module.scss";
import { ProgressBarProps } from "@vuo/types/atomProps";

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${value}%` }}></div>
    </div>
  );
};

export default ProgressBar;
