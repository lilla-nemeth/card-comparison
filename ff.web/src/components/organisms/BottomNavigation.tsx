import { TabBar } from "antd-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons';
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, CoffeeOutlined } from '@ant-design/icons';
import useStackNavigator from "@vuo/utils/StackNavigator";



const BottomNavigation = () => {
    const location = useLocation();
    const { navigateWithState } = useStackNavigator(); 
    const { pathname } = location;

    const hideOnRoutes = ['/'];
    const isVisible = !hideOnRoutes.includes(location.pathname);
  
    const setRouteActive = (value) => {
      navigateWithState(value);
    };

    const handleTabChange = (value) => {
      // Store the current pathname when changing tabs
      // if (pathname !== value) {
      //   sessionStorage.setItem(pathname, pathname);
      // }
      setRouteActive(value);
    };
  
    const tabs = () => {
      return [
        {
          key: '/home',
          title: 'Home',
          icon: <HomeOutlined />,
        },
        {
          key: '/meal-map',
          title: 'MealMap',
          icon: <CoffeeOutlined />,
        },
        {
          key: '/shopping-cart',
          title: 'ShoppingCart',
          icon: <ShoppingCartOutlined />,
        },
        {
          key: '/profile',
          title: 'Profile',
          icon: <UserOutlined />,
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