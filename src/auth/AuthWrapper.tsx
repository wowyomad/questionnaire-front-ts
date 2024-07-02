import { Context, createContext, useContext, useState } from "react";
import { api } from "../services/api";
import UserLogin from "../types/UserLogin";
import { AuthUtils } from "../services/AuthUtils";
import MainHeader from "../components/structure/MainHeader";
import { RenderNavigation } from "../components/structure/RenderNavigation";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from '../assets/bonk.png'


interface ContextProps {
    user: User | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
const defaultContextProps: ContextProps = {
    user: undefined,
    login: async (email: string, password: string) => {
        console.log('login function called with:', email, password);
    },
    logout: () => {
        console.log('logout function called');
    }
}

const authContext: Context<ContextProps> = createContext<ContextProps>(defaultContextProps)
export const AuthData = () => useContext(authContext);


interface User {
    email: string;
    isAuthenticated: boolean;
}

const AuthWrapper = () => {
    const [user, setUser] = useState<User>({ email: "", isAuthenticated: false })

    const login = async (email: string, password: string) => {
        let userLogin: UserLogin = { email, password }
        let auth = await api.login(userLogin)

        AuthUtils.saveAuth(auth)
        setUser({ ...user, email: auth.user.email, isAuthenticated: true })
    }

    const logout = () => {
        AuthUtils.removeAuth()
        setUser({ ...user, isAuthenticated: false })
    }
    const contextProps: ContextProps = { user: AuthUtils.getUser(), login, logout }
    return (
        <authContext.Provider value={contextProps}>
            <MainHeader/>
            <RenderNavigation/>
            <RdnerNavigationContent/>
        </authContext.Provider>
    )
}

export default AuthWrapper;