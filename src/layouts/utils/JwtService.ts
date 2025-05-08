import {jwtDecode} from "jwt-decode";
import { JwtPayload } from "../admin/RequireAdmin";

export function kiemTraTokenHetHan(token: string) {
    const decodedToken = jwtDecode(token);

    if (!decodedToken.exp) {
        // Token không có thời gian hết hạn (exp)
        return false;
    }

    const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

    return currentTime < decodedToken.exp;
}

export function kiemTraToken() {
    const token = localStorage.getItem('token');
    if (token) {
        return true;
    }
    return false;
}


export function getAvatarByToken() {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayload;
        return decodedToken.avatar;
    }
}

export function getTenByToken() {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayload;
        return decodedToken.ten;
    }
}

export function getTenDangNhapByToken() {
    const token = localStorage.getItem('token');
    if (token) {
        return jwtDecode(token).sub;
    }
}

export function getMaNguoiDungByToken() {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayload;
        return decodedToken.maNguoiDung;
    }
}

export function getQuyenByToken() {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayload;
        return decodedToken.quyen;
    }
}

export function dangXuat(navigate: any) {
    navigate("/dang-nhap");
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
}