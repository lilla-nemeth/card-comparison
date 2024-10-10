// ff.web/src/api/api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:7702/v1' //TODO remove these as fetching logic will live in viewModels

// Common headers for all requests
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// fetchMealMap

export const fetchRecipes = async () => {
  const response = await fetch(`${BASE_URL}/mealmap/recipes`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchQuests = async () => {
  const response = await fetch(`${BASE_URL}/quests`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


