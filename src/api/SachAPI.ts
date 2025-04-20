import React from "react";
import SachModel from "../model/SachModel";
import {my_request} from "./Request";

interface KetQuaInterface{
    ketQua: SachModel[];
    tongSoTrang: number;
    tongSoSach: number;
}

// tach duong dan ra -> duong dan thay doi thi ket qua lay dc se thay doi
async function laySach(duongDan: string):Promise<KetQuaInterface>{
    const ketQua:SachModel[] = [];

    // Gọi phương thức request
    const response = await my_request(duongDan);

    // Lấy ra json sach
    const responseData = response._embedded.saches;
    console.log(responseData);

    // lay thong ti trang
    const tongSoTrang:number = response.page.totalPages;
    const tongSoSach:number = response.page.totalElements;

    for (const key in responseData) {
        ketQua.push({
            maSach: responseData[key].maSach,
            tenSach: responseData[key].tenSach,
            giaBan: responseData[key].giaBan,
            giaNiemYet: responseData[key].giaNiemYet,
            moTa: responseData[key].moTa,
            soLuong: responseData[key].soLuong,
            tenTacGia: responseData[key].tenTacGia,
            trungBinhXepHang: responseData[key].trungBinhXepHang
        });
    }
    return {ketQua: ketQua, tongSoTrang: tongSoTrang, tongSoSach: tongSoSach};
}


//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function layToanBoSach(trang: number):Promise<KetQuaInterface> {
    // xac dinh endpoint
    const duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&size=8&page=${trang}`;
    return laySach(duongDan);
}

export async function lay3SachMoiNhatSach():Promise<KetQuaInterface> {
    // xac dinh endpoint
    const duongDan: string = 'http://localhost:8080/sach?sort=maSach,desc&page=0&size=3';
    return laySach(duongDan);
}

//
export async function timKiemSach(tuKhoaTimKiem: string): Promise<KetQuaInterface> {

    // Xác định endpoint
    // xac dinh trang tim kiem xong tra ve
    // duong dan ban dau neu rong se tra ve
    let duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&size=8&page=0`;

    if (tuKhoaTimKiem !== '') {
        duongDan=`http://localhost:8080/sach/search/findByTenSachContaining?sort=maSach,desc&size=8&page=0&tenSach=${tuKhoaTimKiem}`
    }

    return laySach(duongDan);

}