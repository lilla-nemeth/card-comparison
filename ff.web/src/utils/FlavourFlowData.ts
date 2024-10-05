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
        name: "Cauliflower",
        category: "Taste",
      },
      choice1: {
        id: "2",
        title: "Savory",
        elo: 1200,
        image: Day1BaconImage,
        name: "Bacon",
        category: "Taste",
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
        name: "Keto",
        category: "Time & Complexity",
      },
      choice3: {
        id: "4",
        title: "Requires more time",
        elo: 1200,
        image: Day3ChickenImage,
        name: "Chicken",
        category: "Time & Complexity",
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
        name: "Salmon",
        category: "Traditionality",
      },
      choice5: {
        id: "6",
        title: "Unique twist",
        elo: 1200,
        image: Day5MexicanImage,
        name: "Mexican",
        category: "Traditionality",
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
        name: "Stuffed",
        category: "Type of Ingredients",
      },
      choice7: {
        id: "8",
        title: "Variety of ingredients",
        elo: 1200,
        image: Day7BoneImage,
        name: "Bone",
        category: "Type of Ingredients",
      },
    },
  ],
};

export { dataset };
