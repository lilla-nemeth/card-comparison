import { Request, Response } from 'express';
import PlayerQuest, { PlayerQuestState, StepState } from '../models/playerQuestModel';
import Quest from '../models/questModel';
import Recipe from '../models/recipeModel';
import User from '../models/userModel';
import { UserGroup } from '../models/userGroupSchema';
import { GroupMembershipModel } from '../models/userGroupMembershipModel';

const createPlayerQuest = async (req: Request, res: Response) => {
  const { id, scope }: { id: string; scope: number } = req.body;
  try {
    let existingQuest = await PlayerQuest.findOne({ user: req.user.id, quest: id })
    if (existingQuest) {
      res.status(409).json({ message: 'Already playing this quest' })
      return
    }

    const quest = await Quest.findById(id)
    if (!quest) {
      res.status(404).send({ message: 'Quest not found' })
      return
    }

    const recipe = await Recipe.findById(quest!.recipe)

    const playerQuestSteps = recipe!.steps.map(step => ({
      ...step
    }));

    const user = await User.findById(req.user.id)
      .populate<{ activeUserGroup: UserGroup }>('activeUserGroup');
    const userGroup = user!.activeUserGroup

    const members = await GroupMembershipModel.find({ groupId: userGroup.id }).populate('userId');

    const playerQuest = new PlayerQuest({
      media: quest!.media,
      name: quest!.name,
      originalQuestId: id,
      recipe: {
        name: recipe!.name,
        description: recipe!.description,
        steps: playerQuestSteps
      },
      scope: scope || members.length,
      state: PlayerQuestState.inProgress,
      startedAt: new Date(),
      tags: quest!.tags,
      users: members.filter(m => m.userId).map(m => m.userId?._id),
      userGroup
    });

    await playerQuest.save();

    const populatedPlayerQuest = await PlayerQuest.findById(playerQuest._id)
      .populate([
        {
          'path': 'recipe',
          'model': 'Recipe',
          'populate': {
            'path': 'steps',
            'populate': {
              'path': 'skills'
            }
          }
        },
        {
          'path': 'users'
        }
      ]
      )
    res.json(populatedPlayerQuest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updatePlayerQuestProgress = async (req: Request, res: Response) => {
  const { stepId, state } = req.body;
  const { id } = req.params;

  try {
    let playerQuest = await PlayerQuest
      .findOne({ _id: id })
      .populate('tags')
      .populate({
        'path': 'recipe',
        'model': 'Recipe',
        'populate': {
          'path': 'steps',
          'populate': {
            'path': 'skills'
          }
        }
      })

    if (!playerQuest) {
      res.status(404).json({ message: 'PlayerQuest not found' })
      return
    }

    const questStepIndex = playerQuest.recipe.steps.findIndex((step: any) => step._id.toString() === stepId);
    if (questStepIndex === -1) {
      res.status(400).json({ message: 'Step not found' });
      return;
    }

    playerQuest.recipe.steps[questStepIndex].state = state
    playerQuest.recipe.steps[questStepIndex].finishedAt = new Date()

    const allStepsCompleted = playerQuest.recipe.steps.every((step: any) => step.state === StepState.completed);
    if (allStepsCompleted) {
      playerQuest.state = PlayerQuestState.completed;
      playerQuest.finishedAt = new Date()
    }
    await playerQuest.save();

    let updatedPlayerQuest = await PlayerQuest
      .findOne({ _id: id })
      .populate('tags')
      .populate({
        'path': 'recipe',
        'model': 'Recipe',
        'populate': {
          'path': 'steps',
          'populate': [
            { path: 'skills' },
            { path: 'claimedBy', model: 'User' },
            { path: 'finishedBy', model: 'User' }
          ]
        }
      })
    res.json(updatedPlayerQuest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const claimStep = async (req: Request, res: Response) => {
  const { id, stepId } = req.params;

  try {
    let playerQuest = await PlayerQuest.findOne({ _id: id })
    if (!playerQuest) {
      res.status(404).json({ message: 'PlayerQuest not found' })
      return
    }

    const questStepIndex = playerQuest.recipe.steps.findIndex((step: any) => step._id.toString() === stepId);
    if (questStepIndex === -1) {
      res.status(400).json({ message: 'Step not found' });
      return;
    }

    if (playerQuest.recipe.steps[questStepIndex].claimedBy) {
      return res.status(400).json({ message: 'Step already claimed' })
    }
    playerQuest.recipe.steps[questStepIndex].claimedBy = req.user.id
    await playerQuest.save();

    const updatedQuest = await PlayerQuest
      .findOne({ _id: id })
      .populate('tags')
      .populate({
        'path': 'recipe',
        'model': 'Recipe',
        'populate': {
          'path': 'steps',
          'populate': [
            { path: 'skills' },
            { path: 'claimedBy', model: 'User' },
            { path: 'finishedBy', model: 'User' }
          ]
        }
      })
    res.json(updatedQuest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentPlayerQuests = async (req: Request, res: Response) => {
  try {
    const playerQuests = await PlayerQuest
      .find({ users: req.user.id })
      .populate({
        'path': 'recipe',
        'model': 'Recipe',
        'populate': {
          'path': 'steps',
          'populate': [
            { path: 'skills' },
            { path: 'claimedBy', model: 'User' },
            { path: 'finishedBy', model: 'User' }
          ]
        }
      })
      .exec();
    res.json(playerQuests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const getPlayerQuest = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const playerQuest = await PlayerQuest
      .findOne({ _id: id })
      .populate({
        'path': 'recipe',
        'model': 'Recipe',
        'populate': {
          'path': 'steps',
          'model': 'Step',
          'populate': [
            { path: 'skills' },
            { path: 'claimedBy', model: 'User' },
            { path: 'finishedBy', model: 'User' }
          ]
        }
      })
      .populate({ path: 'users', select: 'id username' })
      .exec();
    if (!playerQuest) {
      return res.status(404).json({ message: 'PlayerQuest not found' });
    }

    res.json(playerQuest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export {
  claimStep,
  createPlayerQuest,
  updatePlayerQuestProgress,
  getCurrentPlayerQuests,
  getPlayerQuest
};
