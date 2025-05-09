import {endpointBE} from "../layouts/utils/Constant";
import {my_request} from "./Request";
import DonHangModel from "../model/DonHangModel";
import NguoiDungModel from "../model/NguoiDungModel";
import GioHangModel from "../model/GioHangModel";

export async function layTatCaDonHang(): Promise<DonHangModel[]> {
    try {
        const endpoint: string = endpointBE + "/don-hang?sort=maDonHang,desc&size=100000";
        const response = await my_request(endpoint);

        const datas = await Promise.all(response._embedded.donHangs.map(async (data: any) => {
            const responsePayment = await my_request(endpointBE + `/don-hang/${data.maDonHang}/hinhThucThanhToan`);
            return {
                maDonHang: data.maDonHang,
                diaChiMuaHang: data.diaChiMuaHang,
                tongTienSanPham: data.tongTienSanPham,
                tongTien: data.tongTien,
                chiPhiGiaoHang: data.chiPhiGiaoHang,
                chiPhiThanhToan: data.chiPhiThanhToan,
                ngayTao: data.ngayTao,
                trangThai: data.trangThai,
                nguoiDung: data._embedded.nguoiDung,
                hoVaTen: data.hoVaTen,
                ghiChu: data.ghiChu,
                thanhToan: responsePayment.tenHinhThucThanhToan,
            };
        }));

        return datas;
    } catch (error) {
        console.error("Error while fetching orders:", error);
        throw error;
    }
}


export async function layTatCaDonHangbyMaNguoiDung(maNguoiDung: number): Promise<DonHangModel[]> {
    const endpoint = endpointBE + `/nguoi-dung/${maNguoiDung}/danhSachDonHang?sort=maDonHang,desc`;
    const response = await my_request(endpoint);
    const datas = await Promise.all(response._embedded.donHangs.map(async (data: any) => {
        const responsePayment = await my_request(endpointBE + `/don-hang/${data.maDonHang}/hinhThucThanhToan`);
        const order: DonHangModel = {
            maDonHang: data.maDonHang,
            diaChiMuaHang: data.diaChiMuaHang,
            tongTienSanPham: data.tongTienSanPham,
            tongTien: data.tongTien,
            chiPhiGiaoHang: data.chiPhiGiaoHang,
            chiPhiThanhToan: data.chiPhiThanhToan,
            ngayTao: data.ngayTao,
            trangThai: data.trangThai,
            nguoiDung: data._embedded.nguoiDung,
            hoVaTen: data.hoVaTen,
            ghiChu: data.ghiChu,
            thanhToan: responsePayment.tenHinhThucThanhToan,
        }
        return order;
    }))

    return datas;
}

export async function lay10DonHang(maDonHang: number): Promise<DonHangModel> {
    const endpoint: string = endpointBE + `/don-hang/${maDonHang}`;
    const responseOrder = await my_request(endpoint);
    const responsePayment = await my_request(endpointBE + `/don-hang/${responseOrder.maDonHang}/hinhThucThanhToan`);
    const responseOrderDetail = await my_request(endpointBE + `/don-hang/${responseOrder.maDonHang}/danhSachChiTietDonHang`);
    let gioHang: GioHangModel[] = [];

    // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
    await Promise.all(responseOrderDetail._embedded.chiTietDonHangs.map(async (orderDetail: any) => {
        const responseBook = await my_request(endpointBE + `/chi-tiet-don-hang/${orderDetail.maChiTietDonHang}/sach`);
        gioHang.push({ sach: responseBook, soLuong: orderDetail.soLuong, danhGia: orderDetail.danhGia });
    }));

    const order: DonHangModel = {
        maDonHang: responseOrder.maDonHang,
        diaChiMuaHang: responseOrder.diaChiMuaHang,
        tongTienSanPham: responseOrder.tongTienSanPham,
        tongTien: responseOrder.tongTien,
        chiPhiGiaoHang: responseOrder.chiPhiGiaoHang,
        chiPhiThanhToan: responseOrder.chiPhiThanhToan,
        ngayTao: responseOrder.ngayTao,
        trangThai: responseOrder.trangThai,
        nguoiDung: responseOrder._embedded.nguoiDung,
        hoVaTen: responseOrder.hoVaTen,
        ghiChu: responseOrder.ghiChu,
        thanhToan: responsePayment.tenHinhThucThanhToan,
        soDienThoai:responseOrder.soDienThoai,
        gioHang: gioHang,
    }

    return order;
}