import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { SafeArea } from "antd-mobile";
import "@vuo/scss/app.scss";
import Home from "@vuo/components/pages/Home";

function Layout() {
  return (
    <div className="app">
      <SafeArea position="top" />
      <div className="app-body">
        <Outlet />
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}

const router = createBrowserRouter(
  [
    {
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
      ],
      element: <Layout />,
    },
  ],
  { basename: `${import.meta.env.BASE_URL}` },
);

function App() {
  useEffect(() => {
    document.title = "Vuo App";
  }, []);  
  return <RouterProvider router={router} />;
}

export default App;
