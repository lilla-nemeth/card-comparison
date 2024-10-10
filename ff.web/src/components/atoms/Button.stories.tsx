import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const LargePrimary: Story = {
  args: {
    children: "Primary",
    color: "primary",
    variant: "large",
  },
};

export const HeavyPrimary: Story = {
  args: {
    children: "Heavy!",
    variant: "heavy",
    color: "primary",
  },
};

export const MediumPrimary: Story = {
  args: {
    children: "Medium",
    color: "primary",
    variant: "medium",
  },
};

export const SmallPrimary: Story = {
  args: {
    children: "Small",
    variant: "small",
    color: "primary",
  },
};

export const LargeSecondary: Story = {
  args: {
    children: "Large",
    color: "secondary",
    variant: "large",
  },
};

export const HeavySecondary: Story = {
  args: {
    children: "Heavy!",
    variant: "heavy",
    color: "secondary",
  },
};

export const MediumSecondary: Story = {
  args: {
    children: "Medium",
    color: "secondary",
    variant: "medium",
  },
};

export const SmallSecondary: Story = {
  args: {
    children: "Small",
    variant: "small",
    color: "secondary",
  },
};

export const FigmaDesign = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/bDk31VecUCgLkmuIXa2PCj/Fix-Food-Design-System?node-id=4-4744&t=m9gVP483atAiuV11-4",
    },
  },
};
