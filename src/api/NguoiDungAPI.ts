import NguoiDungModel from "../model/NguoiDungModel";
import {my_request} from "./Request";
import {endpointBE} from "../layouts/utils/Constant";
import {layQuyenByMaNguoiDung} from "./QuyenAPI";

async function layNguoiDung(endpoint: string): Promise<NguoiDungModel> {
    // Gọi phương thức request()
    const response = await my_request(endpoint);

    return response;
}

export async function layToanBoQuyenNguoiDung(): Promise<NguoiDungModel[]> {
    const endpoint: string = endpointBE + `/quyen`;
    const response = await my_request(endpoint);

    const data = response._embedded.quyens.map((quyenData: any) => {
        // Duyệt qua mảng danhSachNguoiDung trong mỗi vai trò (role)
        const users = quyenData._embedded.danhSachNguoiDung.map((userData: any) => {
            // Xử lý các trường dữ liệu trong userData tại đây
            const user: NguoiDungModel = {
                maNguoiDung: userData.maNguoiDung,
                avatar: userData.avatar,
                diaChiGiaoHang: userData.diaChiGiaoHang,
                email: userData.email,
                hoDem: userData.hoDem,
                ten: userData.ten,
                gioiTinh: userData.gioiTinh,
                soDienThoai: userData.soDienThoai,
                tenDangNhap: userData.tenDangNhap,
                quyen: quyenData.tenQuyen,
            };
            return user;
        });
        return users;
    });

    return data;
}

export async function lay1NguoiDung(maNguoiDung: any): Promise<NguoiDungModel> {
    const endpoint = endpointBE + `/nguoi-dung/${maNguoiDung}`;
    const responseUser = await my_request(endpoint);
    const responseRole = await layQuyenByMaNguoiDung(maNguoiDung);

    const user: NguoiDungModel = {
        maNguoiDung: responseUser.maNguoiDung,
        avatar: responseUser.avatar,
        diaChiGiaoHang: responseUser.diaChiGiaoHang,
        email: responseUser.email,
        hoDem: responseUser.hoDem,
        ten: responseUser.ten,
        gioiTinh: responseUser.gioiTinh,
        soDienThoai: responseUser.soDienThoai,
        tenDangNhap: responseUser.tenDangNhap,
        quyen: responseRole.maQuyen,
    };

    return user;
}

export async function LayNguoiDungByMaDanhGia(maDanhGia: number): Promise<NguoiDungModel> {
    // Xác định endpoint
    const endpoint: string = endpointBE + `/su-danh-gia/${maDanhGia}/nguoiDung`;

    return layNguoiDung(endpoint);
}