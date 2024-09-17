import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary",
    color: "primary",
    fill: "solid",
  },
};

export const DefaultButton: Story = {
  args: {
    children: "Default Button!",
    color: "default",
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
