import "@vuo/scss/app.scss";

// import Home from "@vuo/components/pages/Home";

// function Layout() {
//   return (
//     <div className="app">
//       <SafeArea position="top" />
//       <div className="app-body">
//         <Outlet />
//       </div>
//       <SafeArea position="bottom" />
//     </div>
//   );
// }

// const router = createBrowserRouter(
//   [
//     {
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//         {
//           path: "home",
//           element: <Home />,
//         },
//       ],
//       element: <Layout />,
//     },
//   ],
//   { basename: `${import.meta.env.BASE_URL}` },
// );

// function App() {
//   useEffect(() => {
//     document.title = "Vuo App";
//   }, []);  
//   return <RouterProvider router={router} />;
// }

// export default App;

import {
  Route,
  Routes,
  BrowserRouter as Router,
} from 'react-router-dom';
import "./App.css";
import Login from "./components/pages/Login";
import ShoppingCart from "./components/pages/ShoppingCart";
import ProfilePage from "./components/pages/ProfilePage";
import MealMap from "./components/pages/MealMap";
import Home from "./components/pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { SafeArea } from "antd-mobile";
import Navbar from "./components/atoms/Navbar";
import BottomNavigation from "./components/organisms/BottomNavigation";
import NotFoundPage from "./components/pages/NotFoundPage";
import Quest from "./components/pages/Quest";


const App = () => {
  return (
    <div className="app">
      <ThemeProvider>
        <SafeArea position="top" />
          <Router>
          <Navbar/>
            <Routes >
              <Route>
                <Route path='/' element={ <Login />} />
                <Route path='/home' element={<Home />} />
                <Route path='/home/quest' element={<Quest />} />
                <Route path='/meal-map' element={<MealMap />} />
                <Route path='/shopping-cart' element={<ShoppingCart />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              {/* <Route>
                <Route path='/login' element={<Login />} />
                </Route> */}
            </Routes>
            <BottomNavigation/>
          </Router>
          <SafeArea position="bottom" />
        </ThemeProvider>
    </div>
  );
};


export default App;

