import React from "react";
import SachModel from "../model/SachModel";
import {my_request} from "./Request";
import {layToanBoAnhCuaMotSach} from "./HinhAnhAPI";

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


    // lay thong ti trang
    const tongSoTrang:number = response.page.totalPages;
    const tongSoSach:number = response.page.totalElements;

    // Lấy ra danh sách quyển sách
    const bookList: SachModel[] = response._embedded.books.map((bookData: SachModel) => ({
        ...bookData,
    }))

    // Lấy ra ảnh của từng quyển sách
    const bookList1 = await Promise.all(
        bookList.map(async (book: SachModel) => {
            const responseImg = await layToanBoAnhCuaMotSach(book.maSach);
            const thumbnail = responseImg.filter(image => image.thumbnail);
            return {
                ...book,
                thumbnail: thumbnail[0].duongDan,
            };
        })
    );
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
export async function timKiemSach(tuKhoaTimKiem: string, maTheLoai: number): Promise<KetQuaInterface> {

    // Xác định endpoint
    let duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&size=8&page=0`;

    if (tuKhoaTimKiem !== '' && maTheLoai===0) { // maTheLoai la so nen co the su dung ==
        duongDan=`http://localhost:8080/sach/search/findByTenSachContaining?sort=maSach,desc&size=8&page=0&tenSach=${tuKhoaTimKiem}`
    }else  if (tuKhoaTimKiem === '' && maTheLoai>0) {
        duongDan=`http://localhost:8080/sach/search/findByDanhSachTheLoai_MaTheLoai?sort=maSach,desc&size=8&page=0&maTheLoai=${maTheLoai}`
    }else  if (tuKhoaTimKiem !== '' && maTheLoai>0) {
        duongDan=`http://localhost:8080/sach/search/findByTenSachContainingAndDanhSachTheLoai_MaTheLoai?sort=maSach,desc&size=8&page=0&maTheLoai=${maTheLoai}&tenSach=${tuKhoaTimKiem}`
    }

    return laySach(duongDan);

}

// Lấy sách theo id (chỉ lấy thumbnail)
export async function laySachTheoMaSach(maSach: number): Promise<SachModel|null> {

    const duongDan = `http://localhost:8080/sach/${maSach}`;

    let ketQua: SachModel;

    try {
        // Gọi phương thức request
        // Gọi API (qua fetch) đến địa chỉ ví dụ như http://localhost:8080/sach/1
        const response =  await fetch(duongDan);

        if(!response.ok){
            throw new Error('Gặp lỗi trong quá trình gọi API lấy sách!')
        }

        // Chuyển dữ liệu JSON đó thành kiểu SachModel
        const sachData = await response.json();

        if(sachData){
            return {
                maSach: sachData.maSach,
                tenSach: sachData.tenSach,
                giaBan: sachData.giaBan,
                giaNiemYet: sachData.giaNiemYet,
                moTa: sachData.moTa,
                soLuong: sachData.soLuong,
                tenTacGia: sachData.tenTacGia,
                trungBinhXepHang: sachData.trungBinhXepHang
            }
        }else{
            throw new Error('Sách không tồn tài!');
        }
    } catch (error) {
        console.error("Error", error);
        return null;
    }
}