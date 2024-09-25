import { useLocation, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import Page from "../templates/Page";
import useStackNavigator from "@vuo/utils/StackNavigator";
import Section from "../atoms/Section";

const Home = () => {

    const { navigateWithState } = useStackNavigator();  // Initialize navigateWithState function

    const goToQuest = () => {
        // Save the target route to session storage before navigating
        navigateWithState('/home/quest');
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