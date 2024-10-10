import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker";
import { AchievementSize } from "@vuo/models/Achievement";
import QuestLine from "./QuestLine";

const meta: Meta<typeof QuestLine> = {
  title: "Organisms/QuestLine",
  component: QuestLine,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof QuestLine>;


export const Default: Story = {
  args: {
    playerAchievement: {
      id: faker.string.uuid(),
      achievement: {
        _id: 'random',
        name: "Italian master",
        description: "Become the italian kitchen warrior with extremely long description text which would have ellipsis if it works!",
        parent: [],
        size: AchievementSize.mega,
        subAchievements: [
        ]
      },
      completed: false
    },
    subPlayerAchievements: [
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Breakfast",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: true
      },
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Lunch",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: false
      },
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Dinner",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: false
      }
    ]
  }
}

export const MultipleSteps: Story = {
  args: {
    playerAchievement: {
      id: faker.string.uuid(),
      achievement: {
        _id: 'random',
        name: "Italian master",
        description: "Become the italian kitchen warrior with extremely long description text which would have ellipsis if it works!",
        parent: [],
        size: AchievementSize.mega,
        subAchievements: [
        ]
      },
      completed: false
    },
    subPlayerAchievements: [
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Breakfast",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: true
      },
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Lunch",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: false
      },
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Dinner",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: false
      },
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Dinner",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: false
      },
      {
        id: faker.string.uuid(),
        achievement: {
          _id: 'random',
          name: "Italian Dinner",
          description: "Description of this achievement",
          parent: [],
          size: AchievementSize.normal,
          subAchievements: [
          ]
        },
        completed: false
      }
    ]
  }
}