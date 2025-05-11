import GioHangModel from "../../model/GioHangModel";
import {createContext, useContext, useEffect, useState} from "react";

//Quản lý trạng thái giỏ hàng toàn cục (global state) bằng React Context API.
//
// Tự động khởi tạo giỏ hàng từ localStorage khi app load
//
// Cho phép component bất kỳ trong cây CartItemProvider truy cập và cập nhật giỏ hàng
//
// Hạn chế truyền props qua nhiều cấp

interface GioHangProps {
    children: React.ReactNode;
}

interface GioHangType {
    danhSachGioHang: GioHangModel[];
    setDanhSachGioHang: any;
    tongSoSanPham: number;
    setTongSoSanPham: any;
}

const GioHang = createContext<GioHangType | undefined>(undefined);

export const QuanLyGioHang: React.FC<GioHangProps> = (props) => {
    const [danhSachGioHang, setDanhSachGioHang] = useState<GioHangModel[]>([]);
    const [tongSoSanPham, setTongSoSanPham] = useState(0);

    useEffect(() => {
        const cartData: string | null = localStorage.getItem("gioHang");
        let cart: GioHangModel[] = [];
        cart = cartData ? JSON.parse(cartData) : [];
        setDanhSachGioHang(cart);
        setTongSoSanPham(cart.length);
    }, []);

    return (
        <GioHang.Provider
            value={{ danhSachGioHang, setDanhSachGioHang, tongSoSanPham, setTongSoSanPham }}
        >
            {props.children}
        </GioHang.Provider>
    );
};

export const useGioHang = (): GioHangType => {
    const context = useContext(GioHang);
    if (!context) {
        throw new Error("Lỗi context");
    }
    return context;
};