import React from "react";
import styles from "@vuo/scss/components/atoms/Slider.module.scss";
import { SliderProps } from "@vuo/types/atomProps";

const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(Number(event.target.value));
  };

  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        className={styles.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
    </div>
  );
};

export default Slider;
