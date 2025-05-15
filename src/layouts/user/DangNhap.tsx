import React, {useEffect, useState} from 'react';
import {endpointBE} from "../utils/Constant";
import {useGioHang} from "../utils/QuanLyGioHang";
import { useNavigate } from "react-router-dom";
import {useQuanLyDangNhap} from "../utils/QuanLyDangNhap";
import { toast } from 'react-toastify';
import {jwtDecode} from "jwt-decode";
import { JwtPayload } from "../../admin/RequireAdmin";
import GioHangModel from "../../model/GioHangModel";
import {layTatCaGioHangByMaNguoiDung} from "../../api/GioHangAPI";


const DangNhap = () => {
    const { setTongSoSanPham, setDanhSachGioHang } = useGioHang();

    const navigation = useNavigate();
    const { isLoggedIn, setLoggedIn } = useQuanLyDangNhap();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    const handleLogin = async () => {
        const loginRequest = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch(endpointBE + "/tai-khoan/dang-nhap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginRequest),
            });

            if (!response.ok) {
                throw new Error("Đăng nhập thất bại!");
            }

            const data = await response.json();
            const { jwt } = data;
            const decodedToken = jwtDecode(jwt) as JwtPayload;

            // Kiểm tra tài khoản đã kích hoạt chưa
            if (decodedToken.daKichHoat === false) {
                toast.warning("Tài khoản của bạn chưa kích hoạt hoặc đã bị vô hiệu hoá");
                return;
            }

            toast.success("Đăng nhập thành công!");
            localStorage.setItem("token", jwt);
            setLoggedIn(true); // nếu bạn có state này

            // Xử lý giỏ hàng
            let cartData = localStorage.getItem("cart");
            let cart: GioHangModel[] = cartData ? JSON.parse(cartData) : [];

            if (cart.length !== 0) {
                cart = cart.map((c) => ({ ...c, maNguoiDung: decodedToken.maNguoiDung }));

                await fetch(endpointBE + "/chi-tiet-gio-hang/them-gio-hang", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cart),
                });

                const response = await layTatCaGioHangByMaNguoiDung(); // hàm lấy giỏ hàng của user từ server
                localStorage.removeItem("cart");
                localStorage.setItem("cart", JSON.stringify(response));
                setTongSoSanPham(response.length);
                setDanhSachGioHang(response);
            } else {
                const response = await layTatCaGioHangByMaNguoiDung();
                localStorage.removeItem("cart");
                localStorage.setItem("cart", JSON.stringify(response));
                setTongSoSanPham(response.length);
                setDanhSachGioHang(response);
            }

            // Điều hướng theo role
            if (decodedToken.quyen?.toUpperCase() === "ADMIN") {
                navigation("/admin/dashboard");
            } else {
                navigation("/");
            }
        } catch (error) {
            console.error("Đăng nhập thất bại: ", error);
            setError("Tài khoản hoặc mật khẩu không đúng");
            toast.error("Tài khoản hoặc mật khẩu không đúng");
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-start" style={{ minHeight: '80vh', marginTop: '60px' }}>
            <div className="bg-light p-5 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">ĐĂNG NHẬP</h2>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên đăng nhập *</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu *</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3 text-center">
                    <span>Bạn chưa có tài khoản? <a href="/dang-ky">Đăng ký</a></span>
                </div>

                <div className="d-grid mb-3">
                    <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={handleLogin}
                    >
                        ĐĂNG NHẬP
                    </button>
                </div>

                <div className="text-center mb-2">
                    <a href="/quen-mat-khau">Quên mật khẩu</a>
                </div>

                {error && <div className="text-danger text-center">{error}</div>}
            </div>
        </div>

    );
}

export default DangNhap;