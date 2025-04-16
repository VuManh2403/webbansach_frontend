import React from "react";
import SachModel from "../model/SachModel";

//async là từ khóa được dùng để khai báo một hàm bất đồng bộ (asynchronous function).
//Giúp bạn viết mã bất đồng bộ một cách rõ ràng và dễ đọc hơn, thay vì dùng callback hay promise.then() lồng nhau.
//Khi bạn đánh dấu một hàm với từ khóa async, hàm đó tự động trả về một Promise.
async function my_request(duongDan: string) {

    //Bạn chỉ có thể dùng await bên trong async function.
    //await sẽ đợi cho đến khi một Promise hoàn thành rồi mới tiếp tục chạy dòng tiếp theo.
    // Truy cấn đến đường dẫn
    const response = await fetch(duongDan);

    // Nếu bị trả về lỗi
    if (!response.ok) {
        throw new Error(`Không thể truy cập ${duongDan}`);
    }

    // Nếu trả về OK
    // json se tra ve toan bo du lieu
    return response.json();

}

//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function layToanBoSach():Promise<SachModel[]> {
    const ketQua:SachModel[] = [];

    // xac dinh endpoint
    const  duongDan: string = "http://localhost:8080/sach";

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