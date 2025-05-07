import SachModel from "./SachModel";

class GioHangModel{
    maGioHang?: any;
    soLuong: number;
    sach: SachModel;
    maNguoiDung?: number;
    danhGia?: boolean;


    constructor(maGioHang: any, soLuong: number, sach: SachModel, maNguoiDung: number, danhGia: boolean) {
        this.maGioHang = maGioHang;
        this.soLuong = soLuong;
        this.sach = sach;
        this.maNguoiDung = maNguoiDung;
        this.danhGia = danhGia;
    }
}

export default GioHangModel;