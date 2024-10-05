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
      choice: { title: "Sweet", image: CauliflowerImage },
      choice1: { title: "Savory", image: Day1BaconImage },
    },
  ],
  questionset1: [
    {
      choice2: { title: "Quick and easy", image: Day2KetoImage },
      choice3: { title: "Requires more time", image: Day3ChickenImage },
    },
  ],
  questionset2: [
    {
      choice4: { title: "Traditional breakfast", image: Day4SalmonImage },
      choice5: { title: "Unique twist", image: Day5MexicanImage },
    },
  ],
  questionset3: [
    {
      choice6: { title: "Simple ingredients", image: Day6StuffedImage },
      choice7: { title: "Variety of ingredients", image: Day7BoneImage },
    },
  ],
};

export default dataset;
