import { Request, Response } from "express";
import crypto from "crypto";
import { addJobToRecipeLanguageSimplifierQueue } from "../../queues/languageSimplifierQueue";
import Recipe, { RecipeProcessingState, RecipeState } from "../../models/recipeModel";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

interface RecipeQuery {
  field?: string;
  value?: string;
  name?: string;
  skills?: string;
  tools?: string;
  ingredients?: string;
}

const indexRecipes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { field, value, name, skills, tools, ingredients }: RecipeQuery = req.query;

    let filter: any = {};
    if (field && value) {
      filter.steps = {
        $elemMatch: {
          subSteps: {
            $elemMatch: {
              [`reviewStatus.${field}`]: value === 'true'
            }
          }
        }
      };
    }

    if (name) {
      filter.name = { $regex: new RegExp(name.toString(), 'i') }; // 'i' makes the regex case-insensitive
    }

    // Skills filter
    if (skills) {
      filter['steps.subSteps.skills.name'] = { $in: skills.split(',').map(skill => skill.trim()) };
    }

    // Tools filter
    if (tools) {
      filter['steps.subSteps.tools.name'] = { $in: tools.split(',').map(tool => tool.trim()) };
    }

    // Ingredients filter
    if (ingredients) {
      filter['steps.subSteps.resources.name'] = { $in: ingredients.split(',').map(ingredient => ingredient.trim()) };
    }

    const [recipes, total] = await Promise.all([
      Recipe.find(filter).skip(skip).limit(limit),
      Recipe.countDocuments(filter)
    ]);

    res.json({
      recipes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send({
      message: 'Server error',
      error: error instanceof Error ? error.message : error // Send the error message
    });
  }
};

const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data }: { id: string, data: any; } = req.body;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).send({ message: 'Recipe not found' })
    }
    recipe.overwrite({ ...data })
    await recipe?.save()
    res.json(recipe)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Validation Error', details: error.errors });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
    return
  }
}

const approveStepMedia = async (req: Request, res: Response) => {
  const { stepId, suggestedMediaId } = req.body;
  try {
    // Find the recipe containing the stepId and suggestedMediaId
    const recipe = await Recipe.findOne({
      'steps.subSteps._id': stepId,
      'steps.subSteps.suggestedMedias._id': suggestedMediaId,
    });

    if (!recipe) {
      return res.status(404).send({ message: 'Recipe or suggested media not found' });
    }

    // Find the suggested media in the array (optional validation step)
    const suggestedMedia = recipe.steps
      ?.flatMap(step => step.subSteps)
      .find(subStep => subStep?._id.toString() === stepId)
      ?.suggestedMedias?.find(media => media._id.toString() === suggestedMediaId);

    if (!suggestedMedia) {
      return res.status(404).send({ message: 'Suggested media not found' });
    }

    await Recipe.updateOne(
      { 'steps.subSteps._id': stepId },
      {
        $set: {
          'steps.$[].subSteps.$[subStep].media': suggestedMedia,
          'steps.$[].subSteps.$[subStep].reviewStatus.mediaApproved': true
        },
      },
      {
        arrayFilters: [{ 'subStep._id': stepId }],
      }
    );

    const updatedRecipe = await Recipe.findById(recipe._id);
    res.json(updatedRecipe);
  } catch (error) {
    console.log(error)
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Validation Error', details: error.errors });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

const getRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id)
    if (!recipe) {
      return res.status(404).send({ message: 'Recipe not found' })
    }
    res.json(recipe)
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
    return
  }
}

const publishRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id)
    if (!recipe) {
      return res.status(404).send({ message: 'Recipe not found' })
    }
    recipe.state = RecipeState.Published
    await recipe.save();
    res.json(recipe)
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
    return
  }
}

const generateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    addJobToRecipeLanguageSimplifierQueue({ recipeId: id })
    res.status(200).send({ message: 'Job added to queue' })
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
}

function cleanRecipeInstructions(rawInstructions: string): string[] {
  // Remove the outer `c(` and the closing `)`
  const cleaned = rawInstructions
    .replace(/^c\(/, '')  // Remove the starting `c(`
    .replace(/\)$/, '');  // Remove the ending `)`

  // Split the instructions by comma, handling quotes
  // Use regex to match comma followed by a quote and split properly
  const instructions = cleaned
    .split(/",\s*"/) // Split by `", "` or similar patterns
    .map(step => step.replace(/(^"|"$)/g, '')); // Remove any surrounding quotes

  return instructions;
}

function generateRecipeHash(rawText: string): string {
  return crypto.createHash('sha256').update(rawText).digest('hex');
}

const uploadRecipes = async (req: Request, res: Response) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filePath = path.join(__dirname, '../../../uploads/', file.filename);

    const recipesToInsert: Array<{
      rawData: string,
      hash: string,
      processingState: RecipeProcessingState
    }> = []

    fs.createReadStream(file.path)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row) => {
        const { Name: name, Description: description, RecipeIngredientParts: ingredients, RecipeInstructions: rawSteps } = row;

        const steps = cleanRecipeInstructions(rawSteps).join('. ');
        const hash = generateRecipeHash(steps)
        recipesToInsert.push({
          rawData: `${name}. ${description}. ${ingredients}. ${steps}`,
          hash,
          processingState: RecipeProcessingState.NeedProcessing
        });
      })
      .on('end', async () => {
        try {
          for (const recipeData of recipesToInsert) {
            const existingRecipe = await Recipe.findOne({ hash: recipeData.hash });
            if (!existingRecipe) {
              const newRecipe = new Recipe(recipeData);
              await newRecipe.save();
              addJobToRecipeLanguageSimplifierQueue({ recipeId: newRecipe.id })
            }
          }
          fs.unlinkSync(filePath)
          res.status(200).json({ message: "Recipes uploaded successfully" });
        } catch (error) {
          console.error('Error inserting recipes', error);
          res.status(500).json({ message: "Recipes uploading failed", error });
        }
      })
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getUniqueItems = async (req: Request, res: Response) => {
  try {
    // Aggregation for skills
    const uniqueSkills = await Recipe.aggregate([
      { $unwind: "$steps" },
      { $unwind: "$steps.subSteps" },
      { $unwind: "$steps.subSteps.skills" },
      {
        $group: {
          _id: "$steps.subSteps.skills.name",
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, name: "$_id", count: 1 } },
      { $sort: { count: -1 } }
    ]);

    // Aggregation for tools
    const uniqueTools = await Recipe.aggregate([
      { $unwind: "$steps" },
      { $unwind: "$steps.subSteps" },
      { $unwind: "$steps.subSteps.tools" },
      {
        $group: {
          _id: "$steps.subSteps.tools.name",
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, name: "$_id", count: 1 } },
      { $sort: { count: -1 } }
    ]);

    // Aggregation for ingredients
    const uniqueIngredients = await Recipe.aggregate([
      { $unwind: "$steps" },
      { $unwind: "$steps.subSteps" },
      { $unwind: "$steps.subSteps.resources" },
      {
        $group: {
          _id: "$steps.subSteps.resources.name",
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, name: "$_id", count: 1 } },
      { $sort: { count: -1 } }
    ]);

    // Combine the results into a single response
    res.json({
      skills: uniqueSkills,
      tools: uniqueTools,
      ingredients: uniqueIngredients
    });

  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error
    });
  }
};

export { indexRecipes, getRecipe, publishRecipe, updateRecipe, approveStepMedia, generateRecipe, uploadRecipes, getUniqueItems };
