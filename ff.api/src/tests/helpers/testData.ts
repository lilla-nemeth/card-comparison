import jwt from "jsonwebtoken";
import { Achievement, AchievementModel, AchievementType } from "../../models/achievementModel";
import { PlayerAchievementModel } from "../../models/playerAchievementModel";
import PlayerQuest, { PlayerQuestState } from "../../models/playerQuestModel";
import Quest from "../../models/questModel";
import Recipe from "../../models/recipeModel";
import Skill from "../../models/skillModel";
import User from "../../models/userModel";
import { UserGroupModel } from "../../models/userGroupSchema";
import QuestTag from "../../models/questTagModel";
import { GroupMembershipModel, Role } from "../../models/userGroupMembershipModel";

export async function createAnyAchievements(targetCount: number = 1, type: AchievementType = AchievementType.step) {
  const achievementStepCount = new AchievementModel({
    name: `Finished first ${type}`,
    description: `You've finished your first ${type} to greatness!`,
    requirement: {
      any: true,
      targetCount,
      type
    }
  })
  await achievementStepCount.save()
  return achievementStepCount
}

export async function createAchievementsForStep(stepId: string, targetCount: number = 1) {
  const achievementStepCount = new AchievementModel({
    name: "Finished specific step",
    description: "You've finished your specific step!",
    requirement: {
      any: false,
      stepId,
      targetCount,
      type: AchievementType.step,
    }
  })
  await achievementStepCount.save()
  return achievementStepCount
}

export async function createAchievementsForQuest(questId: string, targetCount: number = 1) {
  const achievement = new AchievementModel({
    name: "Finished specific quest",
    description: "You've finished your specific quest!",
    requirement: {
      any: false,
      questId,
      targetCount,
      type: AchievementType.quest,
    }
  })
  await achievement.save()
  return achievement
}

export async function createPlayerAchievements(userId: string, achievement: Achievement) {
  const playerAchievement = new PlayerAchievementModel({
    playerId: userId,
    achievement: achievement._id,
    progress: {
      currentCount: 0,
      completed: false,
    }
  })
  await playerAchievement.save()
  return playerAchievement
}

const createTestData = async () => {
  const skill1 = new Skill({ name: 'Skill 1', challenge_rating: 1, skill_category: 'Category 1', difficulty_level: 'Easy' });
  const skill2 = new Skill({ name: 'Skill 2', challenge_rating: 2, skill_category: 'Category 2', difficulty_level: 'Medium' });
  await skill1.save();
  await skill2.save();

  const recipe = new Recipe({
    ingredients: [{ name: 'Ingredient 1', quantity: '1', unit: 'unit' }],
    name: 'Recipe 1',
    steps: [
      { attachable: true, text: 'Step 1', skills: [skill1._id] },
      { attachable: true, text: 'Step 2', skills: [skill2._id] }
    ],
    description: 'Description 1'
  });
  await recipe.save();

  const recipeB = new Recipe({
    ingredients: [{ name: 'Ingredient 1', quantity: '1', unit: 'unit' }],
    name: 'Recipe 2',
    steps: [
      { attachable: true, text: 'Step 1', skills: [skill1._id], tools: [{ name: "Knife", icon: "knife" }] },
      { attachable: true, text: 'Step 2', skills: [skill2._id] }
    ],
    description: 'Description 2'
  });
  await recipeB.save();

  const tag = new QuestTag({ title: 'Italian' })
  await tag.save();

  const quest = new Quest({ tags: [tag.id], name: 'Quest A', recipe: recipe._id });
  const questB = new Quest({ name: 'Quest B', recipe: recipeB._id });
  await quest.save();
  await questB.save();

  const user = new User({ username: 'testuser' });
  await user.save();
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.VITE_JWT_SECRET!, { expiresIn: '1h' });

  const userGroup = new UserGroupModel({
    name: 'Test Group',
    members: [user]
  });
  await userGroup.save();
  user.activeUserGroup = userGroup.id;
  await user.save();

  const achievement = await createAnyAchievements()
  await createPlayerAchievements(user._id, achievement)

  const playerQuestSteps = recipe.steps.map(step => ({
    ...step
  }))

  const membership = new GroupMembershipModel({
    groupId: userGroup.id,
    role: Role.Host,
    nickname: user.username
  });
  await membership.save()

  const members = await GroupMembershipModel.find({ groupId: userGroup.id }).populate('userId');

  const playerQuest = new PlayerQuest({
    originalQuestId: quest.id,
    recipe: {
      ...recipe,
      steps: playerQuestSteps
    },
    scope: members.length,
    state: PlayerQuestState.inProgress,
    name: quest.name,
    tags: quest.tags,
    media: quest.media,
    users: [user],
    userGroup
  });
  await playerQuest.save();

  return { user, token, playerQuest, quest }
};

const createNewTestUser = async () => {
  const user = new User({ username: 'Test User 2' });
  await user.save();
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.VITE_JWT_SECRET!, { expiresIn: '1h' });

  return { user, token }
}

export { createTestData, createNewTestUser }