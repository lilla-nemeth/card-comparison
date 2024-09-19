import { TabBar } from "antd-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons';

const BottomNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;

    const hideOnRoutes = ['/'];
    const isVisible = !hideOnRoutes.includes(location.pathname);
  
    const setRouteActive = (value) => {
      const lastVisited = sessionStorage.getItem(value);
      navigate(lastVisited || value);
    };

    const handleTabChange = (value) => {
      // Store the current pathname when changing tabs
      if (pathname !== value) {
        sessionStorage.setItem(pathname, pathname);
      }
      setRouteActive(value);
    };
  
    const tabs = () => {
      return [
        {
          key: '/home',
          title: 'Home',
          icon: <AppOutline />,
        },
        {
          key: '/meal-map',
          title: 'MealMap',
          icon: <MessageOutline />,
        },
        {
          key: '/shopping-cart',
          title: 'ShoppingCart',
          icon: <UserOutline />,
        },
        {
          key: '/profile',
          title: 'Profile',
          icon: <UnorderedListOutline />,
        }
      ];
    };
  
    if(isVisible) return (
      <div>
          <TabBar activeKey={pathname} onChange={handleTabChange}>
            {tabs().map(item => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
          </TabBar>
      </div>
    );

    return null
  };

  export default BottomNavigation;