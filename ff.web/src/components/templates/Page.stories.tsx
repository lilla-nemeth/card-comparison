import type { Meta, StoryObj } from "@storybook/react";
import Page from "./Page";

const meta: Meta<typeof Button> = {
  title: "Templates/Page",
  component: Page,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const DefaultPage: Story = {};
