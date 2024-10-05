import CauliflowerImage from "../../public/images/CauliflowerRice.webp";
import Day1BaconImage from "../../public/images/1.webp";
import Day2KetoImage from "../../public/images/2.webp";
import Day3ChickenImage from "../../public/images/3.webp";
import Day4SalmonImage from "../../public/images/4.webp";
import Day5MexicanImage from "../../public/images/5.webp";
import Day6StuffedImage from "../../public/images/6.webp";
import Day7BoneImage from "../../public/images/7.webp";
import { FlavourFlowDataset } from "@vuo/types/dataTypes";

// Dataset
const dataset: FlavourFlowDataset = {
  questionset: [
    {
      choice: {
        id: "1",
        title: "Sweet",
        elo: 1200,
        image: CauliflowerImage,
        category: "Taste",
        name: "Meal 1",
      },
      choice1: {
        id: "2",
        title: "Savory",
        elo: 1200,
        image: Day1BaconImage,
        category: "Taste",
        name: "Meal 2",
      },
    },
  ],
  questionset1: [
    {
      choice2: {
        id: "3",
        title: "Quick and easy",
        elo: 1200,
        image: Day2KetoImage,
        category: "Time & Complexity",
        name: "Meal 3",
      },
      choice3: {
        id: "4",
        title: "Requires more time",
        elo: 1200,
        image: Day3ChickenImage,
        category: "Time & Complexity",
        name: "Meal 4",
      },
    },
  ],
  questionset2: [
    {
      choice4: {
        id: "5",
        title: "Traditional breakfast",
        elo: 1200,
        image: Day4SalmonImage,
        category: "Traditionality",
        name: "Meal 5",
      },
      choice5: {
        id: "6",
        title: "Unique twist",
        elo: 1200,
        image: Day5MexicanImage,
        category: "Traditionality",
        name: "Meal 6",
      },
    },
  ],
  questionset3: [
    {
      choice6: {
        id: "7",
        title: "Simple ingredients",
        elo: 1200,
        image: Day6StuffedImage,
        category: "Type of Ingredients",
        name: "Meal 7",
      },
      choice7: {
        id: "8",
        title: "Variety of ingredients",
        elo: 1200,
        image: Day7BoneImage,
        category: "Type of Ingredients",
        name: "Meal 8",
      },
    },
  ],
};

export { dataset };
