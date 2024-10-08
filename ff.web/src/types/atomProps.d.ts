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
type className = string;

interface CardClassNameProps {
  cardContainerClass?: className;
  cardClass?: className;
  cardDraggedClass?: className;
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

interface CardProps extends CardClassNameProps {
  id?: string;
  meal: FlavourFlowMeal;
  onClick: () => void;
  isSelected?: boolean;

  // Setting direction and dragging the card
  // handleDirectionChange: (direction: "up" | "down") => void;
  // handleDirectionChange(isSelected: boolean): void;
  setDirection?(direction: "up" | "down"): void;
  setIsDragging?: Dispatch<SetStateAction<any>>;
  setIsDragOffBoundary?: Dispatch<SetStateAction<any>>;
  drag?: boolean | "x" | "y" | undefined;
  style?: any;
  index?: number;
  isAnimating?: boolean;
  variants?: any;
  direction?: "up" | "down" | "";
}

// interface DragConstraints {
//   left?: number;
//   right?: number;
//   top?: number;
//   bottom?: number;
// }

// interface DragProps {
//   drag?: boolean | "x" | "y" | undefined;
//   dragConstraints?: DragConstraints;
//   onDragEnd?: (event: MouseEvent | TouchEvent, info: any) => void;
// }

// type Variants = {
//   [key: string]: Variant;
// };

// type AnimateType =
//   | {
//       [key: string]: number | string;
//     }
//   | string;

// interface MotionValues {
//   x: MotionValue<number>;
//   rotate: MotionValue<number>;
//   opacity: MotionValue<number>;
// }

// interface MotionProps {
//   initial?: Variants;
//   whileHover?: Variants;
//   whileTap?: Variants;
//   animate?: AnimateType;
//   transition?: Transition | undefined;
//   selectedMealId: string | null;
//   style?: MotionValues;
// }

// interface CardProps extends CardClassNameProps, DragProps, MotionProps {
//   meals: FlavourFlowMeal[];
//   meal: FlavourFlowMeal;
//   // onClick: MouseEventHandler<HTMLDivElement>;
//   onClick: () => void;
//   isSelected: string | boolean | null;
//   isLoser: string | boolean | null;
//   isActive?: boolean;
//   setIsSelected: any;
//   setIsLoser: any;
// }

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
