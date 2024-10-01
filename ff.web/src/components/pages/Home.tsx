import { useLocation, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import Page from "../templates/Page";
import useStackNavigator from "@vuo/utils/StackNavigator";
import Section from "../atoms/Section";
import { useAppContext } from "@vuo/context/AppContext";
import { useEffect } from "react";

const Home = () => {

    const { navigateWithState } = useStackNavigator();  // Initialize navigateWithState function
    const { isOnboardingComplete } = useAppContext()

    const goToQuest = () => {
        // Save the target route to session storage before navigating
        navigateWithState('/home/quest');
    };

    const goToOnboading = () => {   
        // Save the target route to session storage before navigating
        navigateWithState('/onboarding');
    }
  
    return (
        <Page>
            <Section>
                <h2>Welcome to Fix food</h2>
                <p>Click the button below to start your adventure!</p>
                <Button onClick={goToQuest}>Start Quest</Button>
            </Section>
            {
                !isOnboardingComplete && <Section>
                    {
                        localStorage.getItem('onboardingData') 
                        ? (
                            <>
                            <h2>Finish your onboarding process!</h2>
                            {/* <h3>some progress bar here</h3> */}
                            <Button onClick={goToOnboading}>Start</Button>
                            </>
                        )
                        : (
                            <div>
                                <h2>Start onboarding here</h2>
                                <Button onClick={goToOnboading}>Start</Button>
                            </div>
                        )
                    }
                </Section>

            }

        </Page>
    );
  };

export default Home;