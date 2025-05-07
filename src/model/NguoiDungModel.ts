class NguoiDungModel{
    maNguoiDung: number;
    email: string;
    hoDem: string;
    ten: string;
    tenDangNhap:string;
    matKhau?:string;
    gioiTinh:string;
    soDienThoai:string;
    diaChiMuaHang?:string;
    diaChiGiaoHang:string;
    avatar:string;
    quyen?:number;


    constructor(maNguoiDung: number, email: string, hoDem: string, ten: string, tenDangNhap: string, matKhau: string, gioiTinh: string, soDienThoai: string, diaChiMuaHang: string, diaChiGiaoHang: string, avatar: string, quyen: number) {
        this.maNguoiDung = maNguoiDung;
        this.email = email;
        this.hoDem = hoDem;
        this.ten = ten;
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.gioiTinh = gioiTinh;
        this.soDienThoai = soDienThoai;
        this.diaChiMuaHang = diaChiMuaHang;
        this.diaChiGiaoHang = diaChiGiaoHang;
        this.avatar = avatar;
        this.quyen = quyen;
    }
}

export default NguoiDungModel;