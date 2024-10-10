import Page from "@vuo/templates/Page";
import Button from "@vuo/atoms/Button";
import { ThemeContext } from "@vuo/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { AddSquareOutline } from "antd-mobile-icons";
import useStackNavigator from "@vuo/utils/StackNavigator";



const ProfilePage = function () {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [profileData, setProfileData] = useState<any>(null); // Ensure it's typed correctly
  const { navigateWithState } = useStackNavigator()

  useEffect(() => {
    const storedProfile = localStorage.getItem('profileData');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      delete parsedProfile.completedSteps; // Remove the completedSteps key
      setProfileData(parsedProfile); // Set the modified profile data
    }
  }, []);

  //TODO fix this creappy UI

  return (
    <Page>
      <h2>Hello Stranger</h2>
      {profileData && (
        <div>
          <h4>Your Dietary Preferences</h4>
          {Object.entries(profileData).map(([key, value]) => {
            // Skip rendering if the value is an object but not an array
            if (typeof value === 'object' && !Array.isArray(value)) {
              return null;
            }

            return (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                {Array.isArray(value) ? (
                  <ul>
                    {value.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{value}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Optional Theme Button */}
      <Button
        variant="large"
        color="primary"
        onClick={() => {
          navigateWithState('/onboarding')
        }}
      >
        Edit
      </Button>
      <Button
        tabIndex={0}
        block
        variant="large"
        type="submit"
        color="primary"
        onClick={() => {
          toggleTheme();
        }}
      >
        Change Theme
      </Button>
    </Page>
  );
};

export default ProfilePage;
