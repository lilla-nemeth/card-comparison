import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import Page from "../templates/Page";
import StackNavigator from "@vuo/utils/StackNavigator";
import Section from "../atoms/Section";

const Home = () => {

    const navigate = useNavigate();  // Initialize navigate function
    const { navigateWithState } = StackNavigator();  // Initialize navigateWithState function

    const goToQuest = () => {
        // Save the target route to session storage before navigating
        navigateWithState('/quest');
    };
  
    return (
        <Page>
            <Section>
                <h2>Welcome to Fix food</h2>
                <p>Click the button below to start your adventure!</p>
                <Button onClick={goToQuest}>Start Quest</Button>
            </Section>

        </Page>
    );
  };

export default Home;