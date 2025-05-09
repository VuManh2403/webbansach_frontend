import {useContext, useState,createContext} from "react";
import {kiemTraToken} from "./JwtService";

interface AuthContextProps {
    children: React.ReactNode;
}

interface AuthContextType {
    isLoggedIn: boolean;
    setLoggedIn: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const QuanLyDangNhap: React.FC<AuthContextProps> = (props) => {
    const [isLoggedIn, setLoggedIn] = useState(kiemTraToken());

    return (
        <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useQuanLyDangNhap = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Lỗi context");
    }
    return context;
};