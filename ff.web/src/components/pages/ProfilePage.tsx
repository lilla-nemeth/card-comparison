import Page from "@vuo/templates/Page";
import Button from "@vuo/atoms/Button";
import PageWithNavbarAndTabbar from "../templates/PageWithNavbarAndTabbar";
import { useTheme } from "@vuo/context/ThemeContext";

const ProfilePage = function (props: any) {
  const { theme, toggleTheme } = useTheme();
  console.log(theme)
  return (
    <Page>
          <p>This is an empty profile page.</p>
          <Button
            tabIndex={0}
            block
            color="primary"
            size="large"
            type="submit" 
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
