import React from "react";
import { Variants, Transition, MotionValue } from "framer-motion";

type className = string;

interface CustomButtonProps {
  color?: "primary" | "secondary"; // Custom variants
  variant?: "large" | "heavy" | "medium" | "small"; // Custom sizes
  onClick?: () => void;
  children: React.ReactNode;
  tabIndex?: Number;
  block?: any;
  type?: "button" | "submit" | "reset";
  className?: className;
  disabled?: boolean;
  style?: React.CSSProperties;
}

interface LogoProps {
  className?: className;
  variant: LogoVariants;
}

interface InputProps {
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ProgressBarProps {
  value: number;
  className?: className;
}

interface SectionProps {
  children: React.ReactNode;
}

interface SliderProps {
  value?: number;
  defaultValue?: number[];
  min?: number;
  max: number;
  step?: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number[]) => void;
}

interface IconProps {
  height?: string;
  width?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  className?: className;
}

/* Card */
type className = string;

interface CardClassNameProps {
  cardContainerClass?: className;
  cardClass?: className;
  titleClass?: className;
  textClass?: className;
  btnClass?: className;
  btnIconClass?: className;
  overlayClass?: className;
  imageClass?: className;
  deckContainerClass?: className;
  deckClass?: className;
}

interface CardProps extends CardClassNameProps {
  id?: string;
  meal: FlavourFlowMeal;
  meals?: FlavourFlowMeal[];
  onClick?: () => void;
  isSelected?: boolean;
}

export type {
  CustomButtonProps,
  LogoProps,
  InputProps,
  ProgressBarProps,
  SectionProps,
  SliderProps,
  IconProps,
  CardProps,
};
