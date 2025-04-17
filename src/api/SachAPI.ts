import React from "react";
import SachModel from "../model/SachModel";
import {my_request} from "./Request";

// tach duong dan ra -> duong dan thay doi thi ket qua lay dc se thay doi

async function laySach(duongDan: string):Promise<SachModel[]>{
    const ketQua:SachModel[] = [];

    // Gọi phương thức request
    const response = await my_request(duongDan);

    // Lấy ra json sach
    const responseData = response._embedded.saches;
    console.log(responseData);

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
    return ketQua;
}


//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function layToanBoSach():Promise<SachModel[]> {
    // xac dinh endpoint
    const  duongDan: string = "http://localhost:8080/sach?sort=maSach,desc";
    return laySach(duongDan);
}

export async function lay3SachMoiNhatSach():Promise<SachModel[]> {
    // xac dinh endpoint
    const  duongDan: string = "http://localhost:8080/sach?sort=maSach,desc&page=0&size=3";
    return laySach(duongDan);
}