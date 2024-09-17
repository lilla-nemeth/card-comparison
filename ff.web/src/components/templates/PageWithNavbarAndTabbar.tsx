import Navbar from "../atoms/Navbar";
import BottomNavigation from "../organisms/BottomNavigation"
import Page from "./Page";

const PageWithNavbarAndTabbar = ({children}) => {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}>
    <Navbar />
        <Page>
           
                {children}
        </Page>
    <BottomNavigation />
    </div>
    );
  };

  export default PageWithNavbarAndTabbar;