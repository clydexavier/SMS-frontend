import { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function HomeLayout() {
  const location = useLocation(); // ✅ Hook called unconditionally
  const { token, role } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  } else if (location.pathname === "/" || location.pathname === "/admin/" ||  location.pathname === "/admin") {
    return <Navigate to={`/${role}/intramurals`} />;
  }

  return <Outlet />;
}
