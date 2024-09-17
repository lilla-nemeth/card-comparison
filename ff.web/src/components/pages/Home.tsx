import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import Page from "../templates/Page";
import NavigationLink from "@vuo/utils/NavigationLink";

const Home = () => {

    const navigate = useNavigate();  // Initialize navigate function
    const { navigateWithState } = NavigationLink();  // Initialize navigateWithState function

    const goToQuest = () => {
        // Save the target route to session storage before navigating
        navigateWithState('/quest');
    };
  
    return (
        <Page>
            <div>
                hello honey I am home
                <Button
                    color="primary"
                    onClick={goToQuest}
                >
                    To the quest
                </Button>
            </div>

        </Page>
    );
  };

export default Home;