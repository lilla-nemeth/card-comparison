import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Molecules/Button",
  component: Button,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
  args: {
    children: "Click me!",
    color: "default",
  },
};

export const ElinaButton: Story = {
  args: {
    color: "success",
    children: "Elina on Ihana",
  },
};
