import { createContext, use, useState } from "react";
import React from "react";

export const userContext= createContext();

const ContextProvider = ({children}) => {
    const [role, setRole] = useState('admin');
    const [authenticated, setAuthenticated] = useState(true);
    return (
        <userContext.Provider value= {{role,setRole, authenticated, setAuthenticated}}>
            {children}
        </userContext.Provider>
    )
}
export default ContextProvider