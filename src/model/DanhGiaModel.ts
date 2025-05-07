class DanhGiaModel {
    maDanhGia: number;
    nhanXet: string;
    diemXepHang: number;
    thoiGianDanhGia?: string;


    constructor(maDanhGia: number, nhanXet: string, diemXepHang: number, thoiGianDanhGia: string) {
        this.maDanhGia = maDanhGia;
        this.nhanXet = nhanXet;
        this.diemXepHang = diemXepHang;
        this.thoiGianDanhGia = thoiGianDanhGia;
    }
}

export default DanhGiaModel;