import TheLoaiModel from "./TheLoaiModel";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
class SachModel {
    maSach: number;
    tenSach?: string; // có thể bị NULL
    giaBan: number;
    giaNiemYet: number;
    moTa?:string;
    soLuong: number;
    tenTacGia?:string;
    trungBinhXepHang?:number;
    soLuongBan:number;
    giamGia?:number;
    thumbnail?: string;
    danhSachAnh?: string[];
    maTheLoai?:number;
    danhSachTheLoai?:TheLoaiModel[];


    constructor(maSach: number, tenSach: string, giaBan: number, giaNiemYet: number, moTa: string, soLuong: number, tenTacGia: string, trungBinhXepHang: number, soLuongBan: number, giamGia: number, thumbnail: string, danhSachAnh: string[], maTheLoai: number, danhSachTheLoai: TheLoaiModel[]) {
        this.maSach = maSach;
        this.tenSach = tenSach;
        this.giaBan = giaBan;
        this.giaNiemYet = giaNiemYet;
        this.moTa = moTa;
        this.soLuong = soLuong;
        this.tenTacGia = tenTacGia;
        this.trungBinhXepHang = trungBinhXepHang;
        this.soLuongBan = soLuongBan;
        this.giamGia = giamGia;
        this.thumbnail = thumbnail;
        this.danhSachAnh = danhSachAnh;
        this.maTheLoai = maTheLoai;
        this.danhSachTheLoai = danhSachTheLoai;
    }
}

export default SachModel;