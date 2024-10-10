import { useNavigate, useLocation } from 'react-router-dom';

const useStackNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //TODO do I need input or can I use just the location?

  const navigateWithState = (to: string) => {
    let urlArray = to.split('/')
    urlArray.shift()

    //check if current base has sub route
    if(sessionStorage.getItem(urlArray[0])){
      let savedRoutes = JSON.parse(sessionStorage.getItem(urlArray[0]))
      if(savedRoutes.length > 1) {
        navigate(savedRoutes.join("/"))
        return;
      }
    }

    //New route is saved to session storage
    sessionStorage.setItem(urlArray[0], JSON.stringify(urlArray))
    navigate(to);
  };

  const goBack = () => {
    let currentLocaltion = location.pathname
    let currentBase = currentLocaltion.split('/')[1]
    if(sessionStorage.getItem(currentBase)){
      let savedRoutes = JSON.parse(sessionStorage.getItem(currentBase))
      if(savedRoutes.length > 1) {
        savedRoutes.pop()
        sessionStorage.setItem(currentBase, JSON.stringify(savedRoutes))
        navigate(savedRoutes.join("/"))
      }
    }
  };

  return { navigateWithState, goBack };
};

export default useStackNavigator;