import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes";
import LoginPage from "./pages/public/LoginPage";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";
import RegisterPage from "./pages/public/RegisterPage";
import LandingPage from "./pages/public/LandingPage";

function AppRoutes() {
  return useRoutes([
    { path: "/", element: <LandingPage/> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage/> },
    { path: "/unauthorized", element: <UnauthorizedPage /> },
    ...routes,
  ]);
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
