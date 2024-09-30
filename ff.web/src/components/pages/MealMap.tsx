import { useEffect, useState } from "react";
import Page from "../templates/Page";
import styles from "./MealMap.module.scss";

const fetchRecipes = async () => {
  const response = await fetch('http://localhost:7702/api/mealmap/recipes'); //TODO function goes to api.ts, url to .env
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const organizeMeals = (recipes) => {
  const mealPlan = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const meals = recipes.slice(day * 3, day * 3 + 3).map((recipe, index) => {
      console.log(recipe.media)
      return ({
      id: recipe._id,
      name: recipe.name || `Meal ${index + 1}`,
      description: recipe.description || `Description for Meal ${index + 1}`,
      image: recipe?.media?.image,  //TODO media is undifined in many places, need to fix it + contains tasks
    })});

    mealPlan.push({
      date: currentDate.toDateString(),
      meals,
    });
  }

  return mealPlan;
};

export default function MealMap() {
  const [mealPlan, setMealPlan] = useState(null);

  //TODO use react query for fetching and caching
  useEffect(() => {
    fetchRecipes().then((data) => {
      const organizedMeals = organizeMeals(data);
      setMealPlan(organizedMeals);
    }).catch((error) => {
      console.error('Error fetching recipes:', error);
    });
  }, []);

  console.log(mealPlan);

  return (
    <Page>
      <div className={styles.mealMap}>
        {mealPlan?.map((dayPlan, index) => (
          <div key={index} className={styles.dayPlan}>
            <h3>{dayPlan.date}</h3>
            <div className={styles.mealsGrid}>
              {dayPlan.meals.map((meal) => (
                <div key={meal.id} className={styles.mealBox}>
                  <strong>{meal.name}</strong>
                  <img src={meal?.image} alt={meal.name} />
                  <p>{meal.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}