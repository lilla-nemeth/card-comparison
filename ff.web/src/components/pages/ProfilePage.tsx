import Page from "@vuo/templates/Page";
import Button from "@vuo/atoms/Button";
import { ThemeContext } from "@vuo/context/ThemeContext";
import { ThemeContextProps } from "@vuo/types/themeProps";
import { useContext } from "react";

const ProfilePage = function () {
  const context = useContext<ThemeContextProps | undefined>(ThemeContext);

  if (!context) {
    throw new Error("ThemeContext not found");
  }

  const { toggleTheme } = context;

  return (
    <Page>
      <p>This is an empty profile page.</p>
      <Button
        tabIndex={0}
        block
        variant="large"
        type="submit"
        color="primary"
        onClick={() => toggleTheme()}
      >
        Change theme
      </Button>
    </Page>
  );
};

export default ProfilePage;
