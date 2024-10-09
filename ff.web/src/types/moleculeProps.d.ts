interface RadioGroupProps {
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

interface RadioGroupItemProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

type IsDragOffBoundary = "up" | "down" | null;
type CardSwipeDirection = Record<string, "up" | "down" | "">;

export type {
  RadioGroupProps,
  RadioGroupItemProps,
  ToggleSwitchProps,
  IsDragOffBoundary,
  CardSwipeDirection,
};
