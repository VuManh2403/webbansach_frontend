import {endpointBE} from "./Constant";

// Hàm check email xem tồn tại chưa
export const checkExistEmail = async (setErrorEmail: any, email: string) => {
    const endpoint = endpointBE + `/nguoi-dung/search/existsByEmail?email=${email}`;
    // Call api
    try {
        const response = await fetch(endpoint);
        const data = await response.text();
        if (data === "true") {
            setErrorEmail("Email đã tồn tại!");
            return true;
        }
        return false;
    } catch (error) {
        console.log("Lỗi api khi gọi hàm kiểm tra email");
    }
};

// Hàm check username xem tồn tại chưa
export const checkExistUsername = async (setErrorUsername: any, tenDangNhap: string) => {
    if (tenDangNhap.trim() === "") {
        return false;
    }
    if (tenDangNhap.trim().length < 8) {
        setErrorUsername("Tên đăng nhập phải chứa ít nhất 8 ký tự");
        return true;
    }
    const endpoint = endpointBE + `/nguoi-dung/search/existsByTenDangNhap?tenDangNhap=${tenDangNhap}`;
    // Call api
    try {
        const response = await fetch(endpoint);
        const data = await response.text();

        if (data === "true") {
            setErrorUsername("Tên đăng nhập đã tồn tại!");
            return true;
        }
        return false;
    } catch (error) {
        console.log("Lỗi api khi gọi hàm kiểm tra tên đăng nhập");
    }
};

// Hàm check mật khẩu có đúng định dạng không
export const checkPassword = (setErrorPassword: any, matKhau: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (matKhau === "") {
        return false;
    } else if (!passwordRegex.test(matKhau)) {
        setErrorPassword(
            "Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ và số."
        );
        return true;
    } else {
        setErrorPassword("");
        return false;
    }
};

// Hàm check mật khẩu nhập lại
export const checkRepeatPassword = (setErrorRepeatPassword: any, nhapLaiMatKhau: string, password: string) => {
    if (nhapLaiMatKhau !== password) {
        setErrorRepeatPassword("Mật khẩu không khớp.");
        return true;
    } else {
        setErrorRepeatPassword("");
        return false;
    }
};

// Hàm check số điện thoại có đúng định dạng không
export const checkPhoneNumber = (setErrorPhoneNumber: any, soDienThoai: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (soDienThoai.trim() === "") {
        return false;
    } else if (!phoneRegex.test(soDienThoai.trim())) {
        setErrorPhoneNumber("Số điện thoại không đúng.");
        return true;
    } else {
        setErrorPhoneNumber("");
        return false;
    }
};