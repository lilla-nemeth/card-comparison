import { Request, Response } from "express";

import Quest, { QuestState } from "../models/questModel";

const getQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user
  try {
    const quest = await Quest
      .findOne({
        _id: id,
        $or: [
          { state: { $ne: QuestState.Draft } },
          { state: QuestState.Draft, creator: user.id }
        ]
      })
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
    res.json(quest)
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
    return
  }
};

const getQuests = async (req: Request, res: Response) => {
  try {
    const quests = await Quest
      .find()
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
    res.json(quests)
  } catch (error) {
    console.error('Error occurred:', error);  // Log the full error on the server
    res.status(500).send({
      message: 'Server error',
      error: error instanceof Error ? error.message : error // Send the error message
    });
  }
};

export { getQuest, getQuests };
