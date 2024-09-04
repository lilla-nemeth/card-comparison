import type { Meta, StoryObj } from "@storybook/react";
import ChoiceUI from "./ChoiceUI";

const meta: Meta<typeof ChoiceUI> = {
  title: "Organisms/ChoiceUI",
  component: ChoiceUI,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ChoiceUI>;

export const DefaultChoiceUI: Story = {
  args: {},
};
