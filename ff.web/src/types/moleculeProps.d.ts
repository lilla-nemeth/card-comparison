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

export type { RadioGroupProps, RadioGroupItemProps, ToggleSwitchProps };
