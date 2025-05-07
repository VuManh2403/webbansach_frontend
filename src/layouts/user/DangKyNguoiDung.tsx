import React, { useState } from "react";
import {endpointBE} from "../utils/Constant";
import {Link} from "react-router-dom";

function DangKyNguoiDung() {

    const [tenDangNhap, setTenDangNhap] = useState("");
    const [email, setEmail] = useState("");
    const [hoDem, setHoDen] = useState("");
    const [ten, setTen] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [matKhauLapLai, setMatKhauLapLai] = useState("");
    const [gioiTinh, setGioiTinh] = useState('M');


    // Các biến báo lỗi
    const [errorTenDangNhap, setErrorTenDangNhap] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorMatKhau, setErrorMatKhau] = useState("");
    const [errorMatKhauLapLai, setErrorMatKhauLapLai] = useState("");
    const [thongBao, setThongBao] = useState("");
    const [errorSoDienThoai, setErrorSoDienThoai] = useState("");

    // Xử lý thông tin dc nhap vao tu form submit
    const handleSubmit = async (e: React.FormEvent) => {
        // cho cac bien bao loi ve rong vi da nhap thanh cong
        setErrorTenDangNhap('');
        setErrorEmail('');
        setErrorMatKhau('');
        setErrorMatKhauLapLai('');
        setErrorSoDienThoai('');
        // Tránh click liên tục
        e.preventDefault();

        // Kiểm tra các điều kiện và gán kết quả vào biến
        const isTenDangNhapValid = !await kiemTraTenDangNhapDaTonTai(tenDangNhap);
        const isEmailValid = !await kiemTraEmailDaTonTai(email);
        const isMatKhauValid = !kiemTraMatKhau(matKhau);
        const isMatKhauLapLaiValid = !kiemTraMatKhauLapLai(matKhauLapLai);
        const isSoDienThoaiValid = !kiemTraSoDienThoai(soDienThoai);

        // Kiểm tra tất cả các điều kiện
        if (isTenDangNhapValid && isEmailValid && isMatKhauValid && isMatKhauLapLaiValid && isSoDienThoaiValid ) {
            try {
                const url = endpointBE+'/tai-khoan/dang-ky';

                const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-type' : 'application/json',
                        },
                        body: JSON.stringify({
                            tenDangNhap: tenDangNhap,
                            email: email,
                            matKhau: matKhau,
                            hoDem: hoDem,
                            ten: ten,
                            soDienThoai: soDienThoai,
                            gioiTinh: gioiTinh
                        })
                    }
                );

                if(response.ok){
                    setThongBao("Đăng ký thành công, vui lòng kiểm tra email để kích hoạt!");
                }else{
                    console.log(response.json());
                    setThongBao("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.")
                }
            } catch (error) {
                setThongBao("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.")
            }
        }
    }


    // KIỂM TRA TÊN ĐĂNG NHẬP
    const kiemTraTenDangNhapDaTonTai = async (tenDangNhap: string) => {
        // end-point
        const url = endpointBE+ `/nguoi-dung/search/existsByTenDangNhap?tenDangNhap=${tenDangNhap}`;
        console.log(url);
        // call api
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === "true") {
                setErrorTenDangNhap("Tên đăng nhập đã tồn tại!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi kiểm tra tên đăng nhập:", error);
            return false; // Xảy ra lỗi
        }
    }

    const handleTenDangNhapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setTenDangNhap(e.target.value);
        // Kiểm tra
        setErrorTenDangNhap('');
        // Kiểm tra sự tồn tại
        return kiemTraTenDangNhapDaTonTai(e.target.value);
    }


    // KIỂM TRA EMAIL
    const kiemTraEmailDaTonTai = async (email: string) => {
        // end-point
        const url = endpointBE+ `/nguoi-dung/search/existsByEmail?email=${email}`;
        console.log(url);
        // call api
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === "true") {
                setErrorEmail("Email đã tồn tại!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi kiểm tra email:", error);
            return false; // Xảy ra lỗi
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setEmail(e.target.value);
        // Kiểm tra
        setErrorEmail('');
        // Kiểm tra sự tồn tại
        return kiemTraEmailDaTonTai(e.target.value);
    }


    // KIỂM TRA MẬT KHẨU
    const kiemTraMatKhau = (matKhau: string) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(matKhau)) {
            setErrorMatKhau("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
            return true;
        } else {
            setErrorMatKhau(""); // Mật khẩu hợp lệ
            return false;
        }
    }

    const handleMatKhauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setMatKhau(e.target.value);
        // Kiểm tra
        setErrorMatKhau('');
        // Kiểm tra sự tồn tại
        return kiemTraMatKhau(e.target.value);
    }


    // KIỂM TRA MẬT KHẨU LẶP LẠI
    const kiemTraMatKhauLapLai = (matKhauLapLai: string) => {
        if (matKhauLapLai !== matKhau) {
            setErrorMatKhauLapLai("Mật khẩu không trùng khớp.");
            return true;
        } else {
            setErrorMatKhauLapLai(""); // Mật khẩu trùng khớp
            return false;
        }
    }

    const handleMatKhauLapLaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setMatKhauLapLai(e.target.value);
        // Kiểm tra
        setErrorMatKhauLapLai('');
        // Kiểm tra sự tồn tại
        return kiemTraMatKhauLapLai(e.target.value);
    }

    // so dien thoai
    const kiemTraSoDienThoai = (soDienThoai: string) => {
        // Số điện thoại Việt Nam: bắt đầu bằng 0, theo sau là 9 chữ số
        const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;

        if (!phoneRegex.test(soDienThoai)) {
            setErrorSoDienThoai("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam.");
            return true; // Có lỗi
        } else {
            setErrorSoDienThoai(""); // Số điện thoại hợp lệ
            return false;
        }
    };


    const handleSoDienThoaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setSoDienThoai(e.target.value);
        // Kiểm tra
        setErrorSoDienThoai('');
        // Kiểm tra sự tồn tại
        return kiemTraSoDienThoai(e.target.value);
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-4 text-center">Đăng ký tài khoản</h2>
            <div className="col-lg-6 col-md-8 col-12 mx-auto shadow p-4 rounded bg-light">
                <form onSubmit={handleSubmit}>
                    {/* Tên đăng nhập */}
                    <div className="mb-3">
                        <label htmlFor="tenDangNhap" className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="tenDangNhap"
                            className={`form-control ${errorTenDangNhap ? 'is-invalid' : ''}`}
                            value={tenDangNhap}
                            onChange={handleTenDangNhapChange}
                        />
                        <div className="invalid-feedback">{errorTenDangNhap}</div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${errorEmail ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <div className="invalid-feedback">{errorEmail}</div>
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-3">
                        <label htmlFor="matKhau" className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            id="matKhau"
                            className={`form-control ${errorMatKhau ? 'is-invalid' : ''}`}
                            value={matKhau}
                            onChange={handleMatKhauChange}
                        />
                        <div className="invalid-feedback">{errorMatKhau}</div>
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div className="mb-3">
                        <label htmlFor="matKhauLapLai" className="form-label">Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            id="matKhauLapLai"
                            className={`form-control ${errorMatKhauLapLai ? 'is-invalid' : ''}`}
                            value={matKhauLapLai}
                            onChange={handleMatKhauLapLaiChange}
                        />
                        <div className="invalid-feedback">{errorMatKhauLapLai}</div>
                    </div>

                    {/* Họ đệm và tên */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="hoDem" className="form-label">Họ đệm</label>
                            <input
                                type="text"
                                id="hoDem"
                                className="form-control"
                                value={hoDem}
                                onChange={(e) => setHoDen(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="ten" className="form-label">Tên</label>
                            <input
                                type="text"
                                id="ten"
                                className="form-control"
                                value={ten}
                                onChange={(e) => setTen(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="mb-3">
                        <label htmlFor="soDienThoai" className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            id="soDienThoai"
                            className={`form-control ${errorSoDienThoai ? 'is-invalid' : ''}`}
                            value={soDienThoai}
                            onChange={handleSoDienThoaiChange}
                        />
                        <div className="invalid-feedback">{errorSoDienThoai}</div>
                    </div>

                    {/* Giới tính */}
                    <div className="mb-4">
                        <label htmlFor="gioiTinh" className="form-label">Giới tính</label>
                        <input
                            type="text"
                            id="gioiTinh"
                            className="form-control"
                            value={gioiTinh}
                            onChange={(e) => setGioiTinh(e.target.value)}
                        />
                    </div>
                    <div className='d-flex justify-content-end mt-2 px-3'>
					<span>
						Bạn có tài khoản rồi? <Link to={"/dang-nhap"}>Đăng nhập</Link>
					</span>
                    </div>
                    {/* Nút submit */}
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary px-5">Đăng ký</button>
                        {thongBao && <div className="mt-3 text-success">{thongBao}</div>}
                    </div>
                </form>
            </div>
        </div>

    );
}

export default DangKyNguoiDung;
