class HinhAnhModel {
    maHinhAnh: number;
    tenHinhAnh?: string;
    thumbnail?: boolean;
    duongDan?: string;
    duLieuAnh?: string;


    constructor(maHinhAnh: number, tenHinhAnh?: string, thumbnail?: boolean, duongDan?: string, duLieuAnh?: string) {
        this.maHinhAnh = maHinhAnh;
        this.tenHinhAnh = tenHinhAnh;
        this.thumbnail = thumbnail;
        this.duongDan = duongDan;
        this.duLieuAnh = duLieuAnh;
    }
}

export default HinhAnhModel;