import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes";
import LoginPage from "./pages/public/LoginPage";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";

function AppRoutes() {
  return useRoutes([
    { path: "/login", element: <LoginPage /> },
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
