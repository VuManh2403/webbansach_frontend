import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface props{
    
}

export interface JwtPayload {
    maNguoiDung:any;
    quyen: string;
    avatar:string;
    ten:string;
    daKichHoat:boolean;

}

// tra ve trang admin
const RequireAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    // kiem tra
    const WithAdminCheck: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            // lay token tu local storage
            const token = localStorage.getItem('token');
            // console.log("Token: " + token);

            // Trong tình huống chưa đăng nhập
            if (!token) {
                navigate("/dang-nhap");
                return;
            } else {
                // Giải mã token
                const decodedToken = jwtDecode(token) as JwtPayload;
                // console.log(decodedToken);

                // Lấy thông tin cụ thể
                const quyen = decodedToken.quyen;

                // Kiểm tra không phải là admin
                if (quyen != "ADMIN") {
                    navigate("/bao-loi-403");
                    return;
                }
            }
        }, [navigate]);
        return <WrappedComponent {...props} />
    }
    return WithAdminCheck || null;
}

export default RequireAdmin;