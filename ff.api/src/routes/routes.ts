import express from "express";
import { getMealMapRecipes } from "../controllers/mealMapController";

const router = express.Router();

// Corrected the "/user" route to include the leading slash
router.get("/user", (req, res) => {
  res.send("User route");
});

// Meal map recipes route
router.get("/mealmap/recipes", getMealMapRecipes);

export default router;