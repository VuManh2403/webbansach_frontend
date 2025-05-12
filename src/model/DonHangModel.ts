import GioHangModel from "./GioHangModel";
import NguoiDungModel from "../model/NguoiDungModel";

class DonHangModel{
    maDonHang: number;
    diaChiGiaoHang: string;
    tongTienSanPham: number;
    tongTien: number;
    chiPhiGiaoHang: number;
    chiPhiThanhToan: number;
    ngayTao: Date;
    trangThai: string;
    nguoiDung?: NguoiDungModel;
    hoVaTen?: string;
    soDienThoai?: string;
    ghiChu?: string;
    thanhToan?: string;
    gioHang?: GioHangModel[]


    constructor(maDonHang: number, diaChiGiaoHang: string, tongTienSanPham: number, tongTien: number, chiPhiGiaoHang: number, chiPhiThanhToan: number, ngayTao: Date, trangThai: string, nguoiDung: NguoiDungModel, hoVaTen: string, soDienThoai: string, ghiChu: string, thanhToan: string, gioHang: GioHangModel[]) {
        this.maDonHang = maDonHang;
        this.diaChiGiaoHang = diaChiGiaoHang;
        this.tongTienSanPham = tongTienSanPham;
        this.tongTien = tongTien;
        this.chiPhiGiaoHang = chiPhiGiaoHang;
        this.chiPhiThanhToan = chiPhiThanhToan;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
        this.nguoiDung = nguoiDung;
        this.hoVaTen = hoVaTen;
        this.soDienThoai = soDienThoai;
        this.ghiChu = ghiChu;
        this.thanhToan = thanhToan;
        this.gioHang = gioHang;
    }
}

export default DonHangModel;