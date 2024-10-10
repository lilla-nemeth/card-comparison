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
        category: "Preparation Time",
      },
      choice3: {
        id: "4",
        title: "Requires more time",
        elo: 1200,
        image: Day3ChickenImage,
        name: "Chicken",
        category: "Preparation Time",
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
        category: "Familiarity",
      },
      choice5: {
        id: "6",
        title: "Unique twist",
        elo: 1200,
        image: Day5MexicanImage,
        name: "Mexican",
        category: "Familiarity",
      },
    },
  ],
  questionset3: [
    {
      choice6: {
        id: "7",
        title: "Affordable Ingredients",
        elo: 1200,
        image: Day6StuffedImage,
        name: "Stuffed",
        category: "Cost",
      },
      choice7: {
        id: "8",
        title: "Premium Ingredients",
        elo: 1200,
        image: Day7BoneImage,
        name: "Bone",
        category: "Cost",
      },
    },
  ],
  questionset4: [
    {
      choice8: {
        id: "9",
        title: "Whole Ingredients",
        elo: 1200,
        // would need different image
        image: Day6StuffedImage,
        name: "Chickpea Salad",
        category: "Nutrition Content",
      },
      choice9: {
        id: "10",
        title: "Processed Ingredients",
        elo: 1200,
        // would need different image
        image: Day7BoneImage,
        name: "Chicken Nachos",
        category: "Nutrition Content",
      },
    },
  ],
};

export { dataset };
