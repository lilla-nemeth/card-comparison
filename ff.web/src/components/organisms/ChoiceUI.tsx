import Card from "../atoms/Card";

interface ChoiceUIProps {
  children: React.ReactNode;
} 

const ChoiceUI = ({ children }: ChoiceUIProps) => {
  return (
    <Card title="I am a choice UI">
      Some food for thought
    </Card>
  )
};

export default ChoiceUI;
