import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    role: null,
    setRole: () => {},
    setUser: () => {},
    setToken: () => {}
});

export const ContextProvider = ({children}) => {
    const [role, _setRole] = useState(localStorage.getItem("role") || null);
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    const setRole = (newRole) => {
        localStorage.setItem("role", newRole);
        _setRole(newRole); // Assuming setStateRole is your state setter
      };      
    
    return (
        <StateContext.Provider value={{
            user,
            token,
            role,
            setRole,
            setUser,
            setToken
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)