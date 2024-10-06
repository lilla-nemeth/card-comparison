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
}

interface SectionProps {
  children: React.ReactNode;
}

interface SliderProps {
  value?: number;
  defaultValue: number[];
  min?: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
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
interface CardClassNameProps {
  cardClass?: className;
  titleClass?: className;
  btnActiveClass?: className;
  btnIconActiveClass?: className;
  textActiveClass?: className;
  overlayActiveClass?: className;
  btnClass?: className;
  btnIconClass?: className;
  imageClass?: className;
  deckContainerClass?: className;
  deckClass?: className;
}

// Framer Motion
interface DragConstraints {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

interface DragProps {
  drag?: boolean | "x" | "y" | undefined;
  dragConstraints?: DragConstraints;
  onDragEnd?: (event: MouseEvent | TouchEvent, info: any) => void;
}

type Variants = {
  [key: string]: Variant;
};

type AnimateType =
  | {
      [key: string]: number | string;
    }
  | string;

interface MotionValues {
  x: MotionValue<number>;
  rotate: MotionValue<number>;
  opacity: MotionValue<number>;
}

interface MotionProps {
  initial?: Variants;
  whileHover?: Variants;
  whileTap?: Variants;
  animate?: AnimateType;
  transition?: Transition | undefined;
  selectedMeal: string | null;
  style?: MotionValues;
}

interface CardProps extends CardClassNameProps, DragProps, MotionProps {
  meals: FlavourFlowMeal[];
  meal: FlavourFlowMeal;
  onClick: MouseEventHandler<HTMLDivElement>;
  isSelected: boolean;
  isLoser: boolean | "" | null;
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
