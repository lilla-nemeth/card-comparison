import useStackNavigator from "@vuo/utils/StackNavigator";
import { NavBar } from "antd-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({hideBackButton = false}) {
  useEffect(() => {
    console.log("navbar mounted")
    return () => {
      console.log("navbar unmounted")
    }
  }, [])

  const location = useLocation()
  const navigate = useNavigate();
  const {pathname} = location
  const hideOnRoutes = ['/'];
  const isVisible = !hideOnRoutes.includes(location.pathname);

  const { goBack } = useStackNavigator();

  const getTitle = () => {
    const path = pathname.replace('/', '');
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  //hiding back button on first element of the stack
  if(location.pathname.split("/").length === 2) {
    hideBackButton = true;
  }

  if(isVisible) return (
    <div>
      <NavBar
        back={hideBackButton ? null : ""}
        onBack={() => {
          goBack();
          navigate(-1);
        }}
      >{getTitle()}</NavBar>
    </div>
  )

  return null;
}