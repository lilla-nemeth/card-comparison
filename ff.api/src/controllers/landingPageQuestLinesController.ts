import { Request, Response } from "express";

import LandingPageQuestLines from '../models/landingPageQuestLinesModel';
import { Achievement, AchievementRequirement } from "../models/achievementModel";
import Quest, { IQuest } from "../models/questModel"

export const getQuestLinesForLandingPage = async (req: Request, res: Response) => {
  const { url } = req.params;
  try {
    const landingPageQuests = await LandingPageQuestLines
      .findOne({ url })
      .populate<{ achievements: Achievement[] }>(
        {
          path: 'achievements',
          model: 'Achievement',
          populate: {
            path: 'subAchievements',
            model: 'Achievement'
          }
        });
    if (!landingPageQuests) {
      return res.status(404).json({ message: "Landing page not found" });
    }

    const achievementsWithQuests = await Promise.all(
      landingPageQuests.achievements.map(async (achievement) => {
        const quests = [];
        for (const subAchievement of achievement.subAchievements as Achievement[]) {
          if (subAchievement.requirement && subAchievement.requirement.type === 'quest' && subAchievement.requirement.questId) {
            const quest = await Quest
              .findById(subAchievement.requirement.questId)
              .populate({
                'path': 'recipe',
                'model': 'Recipe'
              })
            if (quest) {
              quests.push(quest);
            }
          }
        }
        return {
          id: achievement.id,
          title: achievement.name,
          description: achievement.description,
          quests: quests
        };
      })
    );
    res.status(200).json(achievementsWithQuests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quests for landing page", error });
  }
};
