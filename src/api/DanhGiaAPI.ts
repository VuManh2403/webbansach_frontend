import React from "react";
import { my_request } from "./Request";
import DanhGiaModel from "../model/DanhGiaModel";

async function layDanhGiaCuaMotSach(endpoint: string): Promise<DanhGiaModel[]> {
    // Gọi phương thức request()
    const response = await my_request(endpoint);

    return response._embedded.reviews.map((reviewData: any) => ({
        ...reviewData,
    }));
}


export async function layToanBoDanhGiaCuaMotSach(maSach: number): Promise<DanhGiaModel[]> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachSuDanhGia`;

    return layDanhGiaCuaMotSach(duongDan);
}


export async function lay1DanhGiaCuaMotSach(maSach: number): Promise<DanhGiaModel[]> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachSuDanhGia?sort=maDanhGia,asc&page=0&size=1`;

    return layDanhGiaCuaMotSach(duongDan);
}