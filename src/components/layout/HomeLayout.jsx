import { useStateContext } from "../../context/ContextProvider";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
    const {token } = useStateContext();
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return (
     <Outlet/>
  )
}
