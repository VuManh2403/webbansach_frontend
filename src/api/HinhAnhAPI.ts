import React from "react";
import HinhAnhModel from "../model/HinhAnhModel";
import {my_request} from "./Request";

async function layAnhCuaMotSach(duongDan: string):Promise<HinhAnhModel[]>{
    const ketQua:HinhAnhModel[] = [];

    // Gọi phương thức request
    const response = await my_request(duongDan);

    // Lấy ra json sach
    const responseData = response._embedded.hinhAnhs;
    // console.log(responseData);

    for (const key in responseData) {
        ketQua.push({
            maHinhAnh: responseData[key].maHinhAnh,
            tenHinhAnh: responseData[key].tenHinhAnh,
            laIcon: responseData[key].laIcon,
            duongDan: responseData[key].duongDan,
            duLieuAnh: responseData[key].duLieuAnh,
        });
    }
    return ketQua;
}

//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function layToanBoAnhCuaMotSach(maSach:number):Promise<HinhAnhModel[]> {
    // xac dinh endpoint
    const  duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh`;

    return layAnhCuaMotSach(duongDan);
}

//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function lay1AnhCuaMotSach(maSach:number):Promise<HinhAnhModel[]> {
    // xac dinh endpoint
    const  duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh?sort=maHinhAnh,asc&page=0&size=1`;

    return layAnhCuaMotSach(duongDan);
}