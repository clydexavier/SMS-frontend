import { useStateContext } from "../../context/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestLayout(){
    const {token, role} = useStateContext();
    if(token){
       return <Navigate to={'/'+ role + '/intramurals'}/>
    }
    return(
        <Outlet />
    )
}