import Card from "../atoms/Card";
import Section from "../atoms/Section";

interface ChoiceUIProps {
  children: React.ReactNode;
} 

const ChoiceUI = ({ children }: ChoiceUIProps) => {
  return (
    <Section>
      <h3>Some food for thought</h3>
    </Section>
  )
};

export default ChoiceUI;
