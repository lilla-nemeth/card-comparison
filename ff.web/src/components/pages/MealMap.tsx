import { useQuery } from '@tanstack/react-query';
import Page from "../templates/Page";
import styles from "./MealMap.module.scss";
import { fetchRecipes } from '@vuo/api/api';

const organizeMeals = (recipes) => {
  const mealPlan = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const meals = recipes.slice(day * 3, day * 3 + 3).map((recipe, index) => ({
      id: recipe._id,
      name: recipe.name || `Meal ${index + 1}`,
      description: recipe.description || `Description for Meal ${index + 1}`,
      image: recipe?.media?.image,  //TODO media is undefined in many places, need to fix it + contains tasks
    }));

    mealPlan.push({
      date: currentDate.toDateString(),
      meals,
    });
  }

  return mealPlan;
};

export default function MealMap() {
  // Updated useQuery to use object form as required in React Query v5
  const { data: recipes, error, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching recipes: {error.message}</p>;

  // Organize the meals after fetching
  const mealPlan = recipes ? organizeMeals(recipes) : [];

  return (
    <Page>
      <div className={styles.mealMap}>
        {mealPlan.map((dayPlan, index) => (
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
