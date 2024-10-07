import { motion } from "framer-motion";
import Button from "./Button";

type Props = {
  direction: "up" | "down";
  onClick: () => void;
};

const CardActionBtn = ({ direction, onClick }: Props) => {
  return (
    <motion.button onClick={onClick}>
      {direction === "up" ? <Button>⬆️</Button> : <Button>⬇️</Button>}
    </motion.button>
  );
};

export default CardActionBtn;
