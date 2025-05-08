import React from "react";
import HinhAnhModel from "../model/HinhAnhModel";
import {my_request} from "./Request";
import {endpointBE} from "../layouts/utils/Constant";

async function layAnhCuaMotSach(duongDan: string):Promise<HinhAnhModel[]>{
    const ketQua:HinhAnhModel[] = [];

    // Gọi phương thức request
    const response = await my_request(duongDan);

    return response._embedded.hinhAnhs.map((imageData: any) => ({
        ...imageData,
    }));
}

//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function layToanBoAnhCuaMotSach(maSach:number):Promise<HinhAnhModel[]> {
    // xac dinh endpoint
    const  duongDan: string =endpointBE + `/sach/${maSach}/danhSachHinhAnh`;

    return layAnhCuaMotSach(duongDan);
}

//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function lay1AnhCuaMotSach(maSach:number):Promise<HinhAnhModel[]> {
    // xac dinh endpoint
    const  duongDan: string = endpointBE+`/sach/${maSach}/danhSachHinhAnh?sort=maHinhAnh,asc&page=0&size=1`;

    return layAnhCuaMotSach(duongDan);
}