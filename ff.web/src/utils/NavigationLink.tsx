import { useNavigate, useLocation } from 'react-router-dom';

export default function NavigationLink() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithState = (location: string) => {
    const urlArray = location.split('/');
    let navigationStack = [];
    if(urlArray.length > 1) {
      navigationStack.push(urlArray[urlArray.length - 1])
    }
    console.log(navigationStack);
    // sessionStorage.setItem(location.pathname, location.pathname + location.search);
    
    // const lastVisited = sessionStorage.getItem(to);
    // navigate(lastVisited || to);
  };

  return {navigateWithState}
}
