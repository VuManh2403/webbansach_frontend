import TheLoaiModel from "../model/TheLoaiModel";
import {my_request} from "./Request";
import {endpointBE} from "../layouts/utils/Constant";

interface ketQuaInterface {
    danhSachTheLoai: TheLoaiModel[];
    theLoai: TheLoaiModel;
}

async function layTheLoai(endpoint: string): Promise<ketQuaInterface> {
    // Gọi phương thức request()
    const response = await my_request(endpoint);

    // Lấy ra danh sách quyển sách
    const danhSachTheLoai: any = response._embedded.theLoais.map((genreData: any) => ({
        ...genreData,
    }))

    return { danhSachTheLoai: danhSachTheLoai, theLoai: response.theLoai };
}

export async function layTatCaTheLoai(): Promise<ketQuaInterface> {
    const endpoint = endpointBE + "/the-loai?sort=maTheLoai";

    return layTheLoai(endpoint);
}

export async function lay1TheLoai(maTheLoai: number): Promise<ketQuaInterface> {
    const endpoint = endpointBE + `/the-loai/${maTheLoai}`;
    const response = await my_request(endpoint);

    return { theLoai: response, danhSachTheLoai: response };
}

export async function layTheLoaiByMaSach(maSach: number): Promise<ketQuaInterface> {
    const endpoint = endpointBE + `/sach/${maSach}/danhSachTheLoai`;

    return layTheLoai(endpoint);
}