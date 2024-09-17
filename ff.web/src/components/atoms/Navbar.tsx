import { NavBar } from "antd-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  useEffect(() => {
    console.log("navbar mounted")
    return () => {
      console.log("navbar unmounted")
    }
  }, [])

  const location = useLocation()
  const {pathname} = location
  const hideOnRoutes = ['/'];
  const isVisible = !hideOnRoutes.includes(location.pathname);

  const navigate = useNavigate();

  const getTitle = () => {
    const path = pathname.replace('/', '');
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  if(isVisible) return (
    <div style={{ border: "2px solid blue", width: "100%" }}>
      <NavBar
        onBack={() => navigate(-1)}
      >{getTitle()}</NavBar>
    </div>
  )

  return null;
}