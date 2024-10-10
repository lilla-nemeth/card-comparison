import { Request, Response } from "express";
import RecipeModel from "../models/recipeModel";

export const getMealMapRecipes = async (req: Request, res: Response) => {

  try {
    const recipes = await RecipeModel
      .find()
      .limit(42);

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'recipes not found' });
    }

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes", error });
  }
};