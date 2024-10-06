import { useState, useEffect } from "react";
// import { ChevronLeft, Search, X } from 'lucide-react'
// import { Button } from "@/components/ui/button"
import Button from "../atoms/Button";
// import Input from "../atoms/Input" //TODO use this instead of html inputs
// import { Label } from "@/components/ui/label" //TODO create a react component for labels
// import RadioGroupItem from "../molecules/RadioGroupItem"
// import RadioGroup from "../molecules/RadioGroup"
import Slider from "../atoms/Slider";
import ProgressBar from "../atoms/ProgressBar";
import ToggleSwitch from "../molecules/ToggleSwitch";
import useStackNavigator from "@vuo/utils/StackNavigator";
import { FormData } from "@vuo/types/dataTypes";
import { useAppContext } from "@vuo/context/AppContext";

enum OnboardingStatus {
  notStarted = "notStarted",
  completed = "completed",
}

const steps = [
  {
    id: "intro",
    title: "Your meal plan awaits",
    status: OnboardingStatus.notStarted,
  },
  { id: "goals", title: "Your goals", status: OnboardingStatus.notStarted },
  { id: "sex", title: "About you", status: OnboardingStatus.notStarted },
  { id: "age", title: "Age", status: OnboardingStatus.notStarted },
  { id: "height", title: "Height" },
  {
    id: "current-weight",
    title: "Current weight",
    status: OnboardingStatus.notStarted,
  },
  {
    id: "goal-weight",
    title: "Goal weight",
    status: OnboardingStatus.notStarted,
  },
  {
    id: "motivation",
    title: "Motivation",
    status: OnboardingStatus.notStarted,
  },
  {
    id: "activity",
    title: "Activity level",
    status: OnboardingStatus.notStarted,
  },
  { id: "mindset", title: "Your mindset", status: OnboardingStatus.notStarted },
  { id: "speed", title: "Speed", status: OnboardingStatus.notStarted },
  { id: "diet-plan", title: "Diet plan" },
  {
    id: "past-experience",
    title: "Past experience",
    status: OnboardingStatus.notStarted,
  },
  { id: "format", title: "Format", status: OnboardingStatus.notStarted },
  { id: "allergies", title: "Allergies", status: OnboardingStatus.notStarted },
  { id: "dislikes", title: "Dislikes", status: OnboardingStatus.notStarted },
  { id: "cuisines", title: "Cuisines", status: OnboardingStatus.notStarted },
  { id: "pantry", title: "Your pantry", status: OnboardingStatus.notStarted },
  {
    id: "cooking-skills",
    title: "Cooking skills",
    status: OnboardingStatus.notStarted,
  },
];

const allergies = [
  "Shellfish",
  "Fish",
  "Dairy",
  "Peanut",
  "Tree nut",
  "Egg",
  "Gluten",
  "Soy",
  "Sesame",
];
const commonDislikes = [
  "beef",
  "beets",
  "bell peppers",
  "broccoli",
  "brussels sprouts",
  "cilantro",
  "eggplant",
  "eggs",
  "fish",
  "ginger",
  "kale",
  "mayonnaise",
  "mushrooms",
  "okra",
  "olives",
  "peas",
];
const cuisines = [
  "American",
  "Italian",
  "Mexican",
  "Asian",
  "Chinese",
  "Japanese",
  "Thai",
  "Indian",
];
// TODO add the status of the steps to the formData object, (you may need to modify the rendering of the steps)
export default function OnboardingFlow() {
  const { navigateWithState } = useStackNavigator();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { setIsOnboardingComplete } = useAppContext();
  const onboardingData: string | null = localStorage.getItem("onboardingData");
  const [formData, setFormData] = useState<FormData>({
    goals: [],
    sex: "",
    age: "",
    height: "",
    currentWeight: "",
    goalWeight: "",
    motivation: "",
    activityLevel: "",
    mindset: "",
    speed: "moderate",
    dietPlan: "",
    pastExperience: "",
    format: "",
    allergies: [],
    dislikes: [],
    cuisinePreferences: {},
    pantry: "",
    cookingSkills: "",
  });

  useEffect(() => {
    //check if user has already started onboarding
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setFormData(data ? data : {});

      let stepsDone = Object.entries(data).filter(([_, value]) => value).length;
      let allSteps = Object.keys(data).length;

      setProgress((stepsDone / allSteps) * 100);
    } else {
      setProgress((currentStep / (steps.length - 1)) * 100);
    }
  }, [currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (
    item: string,
    field: "goals" | "allergies" | "dislikes",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleCuisinePreference = (
    cuisine: string,
    preference: "like" | "dislike",
  ) => {
    setFormData((prev) => ({
      ...prev,
      cuisinePreferences: {
        ...prev.cuisinePreferences,
        [cuisine]:
          preference === prev.cuisinePreferences[cuisine] ? null : preference,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      localStorage.setItem("onboardingData", JSON.stringify(formData));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("profileData", JSON.stringify(formData));
    localStorage.removeItem("onboardingData");
    setIsOnboardingComplete(true);
    navigateWithState("/home");
  };

  const renderStep = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case "intro":
        return (
          <div className="space-y-4">
            {/* <img src="/placeholder.svg?height=200&width=200" alt="Lemons" className="mx-auto" /> */}
            <h2 className="text-2xl font-bold text-center">{step.title}</h2>
            <p className="text-center text-gray-600">
              We'll learn about your goals and preferences to help build your
              first custom meal plan.
            </p>
          </div>
        );
      case "goals":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">
              What can we help you accomplish? We'll personalize our
              recommendations based on your goals.
            </p>
            {[
              "Lose weight",
              "Hit my macros",
              "Eat healthy",
              "Gain weight",
              "Save time",
            ].map((goal) => (
              <Button
                key={goal}
                color={formData.goals.includes(goal) ? "primary" : "secondary"}
                onClick={() => handleMultiSelect(goal, "goals")}
              >
                {goal}
              </Button>
            ))}
          </div>
        );
      case "sex":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              What is your sex? We'll use this to estimate your daily energy
              needs.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="female"
                id="female"
                checked={formData.sex === "female"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sex: e.target.value }))
                }
              />
              <label htmlFor="female">Female</label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="male"
                id="male"
                checked={formData.sex === "male"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sex: e.target.value }))
                }
              />
              <label htmlFor="male">Male</label>
            </div>
          </div>
        );

      case "age":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">How old are you?</p>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
            />
          </div>
        );
      case "height":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">How tall are you?</p>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="Enter your height in cm"
            />
          </div>
        );
      case "current-weight":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">How much do you currently weigh?</p>
            <input
              type="number"
              name="currentWeight"
              value={formData.currentWeight}
              onChange={handleInputChange}
              placeholder="Enter your weight in kg"
            />
          </div>
        );
      case "goal-weight":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">What is your goal weight?</p>
            <input
              type="number"
              name="goalWeight"
              value={formData.goalWeight}
              onChange={handleInputChange}
              placeholder="Enter your goal weight in kg"
            />
          </div>
        );
      case "motivation":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              How would you describe your current motivation to plan healthy
              meals and meet your nutrition goals?
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="ready-to-tackle-anything"
                id="ready-to-tackle-anything"
                checked={formData.motivation === "ready-to-tackle-anything"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    motivation: e.target.value,
                  }))
                }
              />
              <label htmlFor="ready-to-tackle-anything">
                Ready to tackle anything (Prefer big changes)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="willing-to-give-it-a-go"
                id="willing-to-give-it-a-go"
                checked={formData.motivation === "willing-to-give-it-a-go"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    motivation: e.target.value,
                  }))
                }
              />
              <label htmlFor="willing-to-give-it-a-go">
                Willing to give it a go (Prefer moderate changes)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="small-changes-are-best"
                id="small-changes-are-best"
                checked={formData.motivation === "small-changes-are-best"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    motivation: e.target.value,
                  }))
                }
              />
              <label htmlFor="small-changes-are-best">
                Small changes are best (Prefer to take things step by step)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="not-ready-yet"
                id="not-ready-yet"
                checked={formData.motivation === "not-ready-yet"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    motivation: e.target.value,
                  }))
                }
              />
              <label htmlFor="not-ready-yet">Not ready yet</label>
            </div>
          </div>
        );
      case "activity":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>How often do you exercise?</p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="sedentary"
                id="sedentary"
                checked={formData.activityLevel === "sedentary"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activityLevel: e.target.value,
                  }))
                }
              />
              <label htmlFor="sedentary">
                Sedentary (No exercise, desk job)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="light-exercise"
                id="light-exercise"
                checked={formData.activityLevel === "light-exercise"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activityLevel: e.target.value,
                  }))
                }
              />
              <label htmlFor="light-exercise">
                Light exercise (1-2 days per week)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="moderate-exercise"
                id="moderate-exercise"
                checked={formData.activityLevel === "moderate-exercise"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activityLevel: e.target.value,
                  }))
                }
              />
              <label htmlFor="moderate-exercise">
                Moderate exercise (3-5 days per week)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="heavy-exercise"
                id="heavy-exercise"
                checked={formData.activityLevel === "heavy-exercise"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activityLevel: e.target.value,
                  }))
                }
              />
              <label htmlFor="heavy-exercise">
                Heavy exercise (6-7 days per week)
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="athlete"
                id="athlete"
                checked={formData.activityLevel === "athlete"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activityLevel: e.target.value,
                  }))
                }
              />
              <label htmlFor="athlete">
                Athlete (Daily exercise or heavy labor)
              </label>
            </div>
          </div>
        );

      case "mindset":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              How do you relate to the statement: "I know what I should be doing
              to eat healthy, but I need to find a way to do it that fits into
              my life"?
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="agree"
                id="agree"
                checked={formData.mindset === "agree"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mindset: e.target.value }))
                }
              />
              <label htmlFor="agree">Agree</label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="neutral"
                id="neutral"
                checked={formData.mindset === "neutral"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mindset: e.target.value }))
                }
              />
              <label htmlFor="neutral">Neutral</label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="disagree"
                id="disagree"
                checked={formData.mindset === "disagree"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mindset: e.target.value }))
                }
              />
              <label htmlFor="disagree">Disagree</label>
            </div>
          </div>
        );

      case "speed":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">
              Based on your information, we recommend a moderate pace, but feel
              free to adjust!
            </p>
            <div className="flex items-center justify-between">
              <span>🐢</span>
              <Slider
                defaultValue={[1]}
                max={3}
                step={1}
                onChange={(value) => {
                  const speedMap = ["slow", "moderate", "fast"];
                  if (Array.isArray(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      speed: speedMap[value[0] - 1],
                    }));
                  }
                }}
              />
              <span>⚡</span>
            </div>
            <p className="text-center font-semibold">
              {formData.speed.charAt(0).toUpperCase() + formData.speed.slice(1)}
            </p>
            <p className="text-center text-sm text-gray-600">
              {formData.speed === "slow" && "Sustainable and gradual pace"}
              {formData.speed === "moderate" && "Sustainable and moderate pace"}
              {formData.speed === "fast" && "Ambitious and quick pace"}
            </p>
          </div>
        );
      case "diet-plan":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              We'll start with a 1 week custom plan to help you gain weight.
              Which plan best suits your preferences?
            </p>

            {[
              {
                name: "Balanced",
                description: "Flexible approach, thoughtful portions",
              },
              { name: "Pescatarian", description: "Seafood, healthy fats" },
              { name: "Flexitarian", description: "Less meat, heart-healthy" },
              {
                name: "Vegetarian",
                description: "Clean eating, complex carbs",
              },
              { name: "Low carb", description: "Reduced carbohydrate intake" },
              { name: "Keto", description: "High fat, very low carb" },
            ].map((diet) => (
              <div
                key={diet.name}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="radio"
                  value={diet.name.toLowerCase()}
                  id={diet.name.toLowerCase()}
                  checked={formData.dietPlan === diet.name.toLowerCase()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dietPlan: e.target.value,
                    }))
                  }
                />
                <label htmlFor={diet.name.toLowerCase()}>
                  <span style={{ fontWeight: "600" }}>{diet.name}</span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#4B5563",
                    }}
                  >
                    {diet.description}
                  </span>
                </label>
              </div>
            ))}
          </div>
        );
      case "past-experience":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              What best describes your experience with changing the way you eat?
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="no-past-experience"
                id="no-past-experience"
                checked={formData.pastExperience === "no-past-experience"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pastExperience: e.target.value,
                  }))
                }
              />
              <label htmlFor="no-past-experience">
                <span style={{ fontWeight: "600" }}>No past experience</span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#4B5563",
                  }}
                >
                  Trying to make changes for the first time
                </span>
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="tried-before"
                id="tried-before"
                checked={formData.pastExperience === "tried-before"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pastExperience: e.target.value,
                  }))
                }
              />
              <label htmlFor="tried-before">
                <span style={{ fontWeight: "600" }}>Tried before</span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#4B5563",
                  }}
                >
                  Giving healthy eating another shot
                </span>
              </label>
            </div>
          </div>
        );

      case "format":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              What meals would you like to plan? You can adjust this if you
              change your mind later!
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="dinners"
                id="dinners"
                checked={formData.format === "dinners"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, format: e.target.value }))
                }
              />
              <label htmlFor="dinners">
                <span style={{ fontWeight: "600" }}>Dinners</span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#4B5563",
                  }}
                >
                  A few dinner ideas every week
                </span>
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="lunches-and-dinners"
                id="lunches-and-dinners"
                checked={formData.format === "lunches-and-dinners"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, format: e.target.value }))
                }
              />
              <label htmlFor="lunches-and-dinners">
                <span style={{ fontWeight: "600" }}>Lunches and dinners</span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#4B5563",
                  }}
                >
                  Make lunch and dinner most days
                </span>
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="every-meal"
                id="every-meal"
                checked={formData.format === "every-meal"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, format: e.target.value }))
                }
              />
              <label htmlFor="every-meal">
                <span style={{ fontWeight: "600" }}>Every meal</span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#4B5563",
                  }}
                >
                  Make breakfast, lunch, dinner every day
                </span>
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                value="custom"
                id="custom"
                checked={formData.format === "custom"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, format: e.target.value }))
                }
              />
              <label htmlFor="custom">Custom</label>
            </div>
          </div>
        );

      case "allergies":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">
              Do you have any food allergies or restrictions?
            </p>
            {allergies.map((allergy) => (
              <div
                key={allergy}
                className="flex items-center justify-between border-b border-gray-200 py-2"
              >
                <label htmlFor={allergy} className="text-base">
                  {allergy}
                </label>
                <ToggleSwitch
                  // id={allergy}
                  checked={formData.allergies.includes(allergy)}
                  onCheckedChange={() =>
                    handleMultiSelect(allergy, "allergies")
                  }
                />
              </div>
            ))}
            <p className="text-sm text-gray-500 mt-4">
              If you have other allergies or restrictions that aren't listed
              here, you can add them as a "dislike" on the next page! Any
              recipes that contain a disliked ingredient will not be recommended
              to you.
            </p>
          </div>
        );
      case "dislikes":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">Are there any foods you dislike?</p>
            <div className="relative">
              <input
                placeholder="Search"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  console.log("Searching for:", value);
                }}
              />
            </div>
            {formData.dislikes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.dislikes.map((dislike) => (
                  <Button
                    key={dislike}
                    color="secondary"
                    onClick={() => handleMultiSelect(dislike, "dislikes")}
                  >
                    {dislike}X
                  </Button>
                ))}
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                COMMON DISLIKES
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {commonDislikes.map((dislike) => (
                  <Button
                    key={dislike}
                    color={
                      formData.dislikes.includes(dislike)
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => handleMultiSelect(dislike, "dislikes")}
                  >
                    {dislike}
                    {formData.dislikes.includes(dislike) && "X"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case "cuisines":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-600">
              Are there any cuisines you especially like or dislike?
            </p>
            {cuisines.map((cuisine) => (
              <div
                key={cuisine}
                className="flex items-center justify-between border-b border-gray-200 py-2"
              >
                <span className="text-base">{cuisine}</span>
                <div className="flex space-x-2">
                  <Button
                    color={
                      formData.cuisinePreferences[cuisine] === "dislike"
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => handleCuisinePreference(cuisine, "dislike")}
                  >
                    👎
                  </Button>
                  <Button
                    color={
                      formData.cuisinePreferences[cuisine] === "like"
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => handleCuisinePreference(cuisine, "like")}
                  >
                    ❤️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      case "pantry":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              How well-stocked is your kitchen right now?
            </p>

            {[
              {
                value: "empty",
                label: "Empty",
                description: "Don't have anything",
              },
              {
                value: "basic",
                label: "Basic",
                description: "Only have oil, salt, and pepper",
              },
              {
                value: "average",
                label: "Average",
                description: "Have common spices and seasonings",
              },
              {
                value: "well-stocked",
                label: "Well-stocked",
                description: "Have a wide selection of spices and seasonings",
              },
            ].map((option) => (
              <div
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  value={option.value}
                  id={option.value}
                  checked={formData.pantry === option.value}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pantry: e.target.value }))
                  }
                />
                <label
                  htmlFor={option.value}
                  style={{ flexGrow: 1, cursor: "pointer" }}
                >
                  <span style={{ fontWeight: "600" }}>{option.label}</span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#4B5563",
                    }}
                  >
                    {option.description}
                  </span>
                </label>
              </div>
            ))}
          </div>
        );

      case "cooking-skills":
        return (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {step.title}
            </h2>
            <p style={{ color: "#4B5563" }}>
              How would you describe your cooking skills?
            </p>

            {[
              {
                value: "novice",
                label: "Novice",
                description: '"I can cook boxed mac and cheese"',
              },
              {
                value: "basic",
                label: "Basic",
                description: '"I only cook simple recipes"',
              },
              {
                value: "intermediate",
                label: "Intermediate",
                description: '"I routinely try new recipes"',
              },
              {
                value: "advanced",
                label: "Advanced",
                description: '"I\'m comfortable cooking any recipe"',
              },
            ].map((option) => (
              <div
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  value={option.value}
                  id={option.value}
                  checked={formData.cookingSkills === option.value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cookingSkills: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor={option.value}
                  style={{ flexGrow: 1, cursor: "pointer" }}
                >
                  <span style={{ fontWeight: "600" }}>{option.label}</span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#4B5563",
                    }}
                  >
                    {option.description}
                  </span>
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressBar value={progress} />
      {currentStep > 0 && (
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
      )}
      {renderStep()}
      {currentStep < steps.length - 1 && (
        <Button onClick={handleNext}>Next</Button>
      )}
      {currentStep === steps.length - 1 && (
        <Button onClick={handleFinish}>Finish</Button>
      )}
    </div>
  );
}
