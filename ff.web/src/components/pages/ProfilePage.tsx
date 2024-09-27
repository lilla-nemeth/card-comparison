import Page from "@vuo/templates/Page";
import Button from "@vuo/atoms/Button";
import { ThemeContext } from "@vuo/context/ThemeContext";
import { useContext } from "react";
import {AddSquareOutline} from "antd-mobile-icons"


const ProfilePage = function (props: any) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // console.log(theme)
  return (
    <Page>
          <p>This is an empty profile page.</p>
          <Button
            tabIndex={0}
            block
            variant="large"
            type="submit" 
            color="primary"
            onClick={() => {
              toggleTheme()
            }} 
          >
            Change theme
          </Button>
    </Page>
  );
};

export default ProfilePage;
