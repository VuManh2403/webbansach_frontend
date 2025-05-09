import React from "react";
import {my_request, requestAdmin} from "./Request";
import DanhGiaModel from "../model/DanhGiaModel";
import {endpointBE} from "../layouts/utils/Constant";

async function layDanhGiaCuaMotSach(endpoint: string): Promise<DanhGiaModel[]> {
    // Gọi phương thức request()
    const response = await my_request(endpoint);

    return response._embedded.suDanhGias.map((reviewData: any) => ({
        ...reviewData,
    }));
}


export async function layToanBoDanhGiaCuaMotSach(maSach: number): Promise<DanhGiaModel[]> {
    // Xác định endpoint
    const duongDan: string = endpointBE+ `/sach/${maSach}/danhSachSuDanhGia`;

    return layDanhGiaCuaMotSach(duongDan);
}


export async function layTongSoDanhGia(): Promise<number> {
    const endpoint = endpointBE + "/su-danh-gia/search/countBy";
    try {
        const response = await requestAdmin(endpoint);
        if (response) {
            return response;
        }
    } catch (error) {
        throw new Error("Lỗi không gọi được endpoint lấy tổng review\n" + error);
    }
    return 0;
}