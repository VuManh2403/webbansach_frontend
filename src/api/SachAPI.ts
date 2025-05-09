import React from "react";
import SachModel from "../model/SachModel";
import {my_request, requestAdmin} from "./Request";
import {layToanBoAnhCuaMotSach} from "./HinhAnhAPI";
import {endpointBE} from "../layouts/utils/Constant";
import TheLoaiModel from "../model/TheLoaiModel";
import {layTheLoaiByMaSach} from "./TheLoaiAPI";

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

export async function laySachHot(): Promise<KetQuaInterface> {
    // Xác định endpoint
    const endpoint: string = endpointBE + "/sach?sort=trungBinhXepHang,desc&size=4";

    return laySach(endpoint);
}

export async function laySachMoi(): Promise<KetQuaInterface> {
    // Xác định endpoint
    const endpoint: string = endpointBE + "/sach?sort=idBook,desc&size=4";

    return laySach(endpoint);
}

//Khi bạn dùng export async function trong JavaScript hoặc TypeScript, bạn đang vừa khai báo một hàm bất đồng bộ, vừa xuất (export) nó ra ngoài để các file/module khác có thể sử dụng.
export async function layToanBoSach(trang: number):Promise<KetQuaInterface> {
    // xac dinh endpoint
    const duongDan: string = endpointBE+`/sach?sort=maSach,desc&size=8&page=${trang}`;
    return laySach(duongDan);
}

export async function lay3SachBanChay():Promise<SachModel[]> {
    // xac dinh endpoint
    const endpoint: string = endpointBE+'/sach?sort=soLuongBan,desc&page=0&size=3';
    let bookList = await laySach(endpoint);
    // Use Promise.all to wait for all promises in the map to resolve
    let newBookList = await Promise.all(bookList.ketQua.map(async (book: any) => {
        // Trả về quyển sách
        const responseImg = await layToanBoAnhCuaMotSach(book.idBook);
        const thumbnail = responseImg.find(image => image.thumbnail);

        return {
            ...book,
            thumbnail: thumbnail ? thumbnail.duongDan : null,
        };
    }));

    return newBookList;
}

//
export async function timKiemSach(tuKhoaTimKiem: string, maTheLoai: number): Promise<KetQuaInterface> {

    // Xác định endpoint
    let duongDan: string = endpointBE+`/sach?sort=maSach,desc&size=8&page=0`;

    if (tuKhoaTimKiem !== '' && maTheLoai===0) { // maTheLoai la so nen co the su dung ==
        duongDan=endpointBE+`/sach/search/findByTenSachContaining?sort=maSach,desc&size=8&page=0&tenSach=${tuKhoaTimKiem}`
    }else  if (tuKhoaTimKiem === '' && maTheLoai>0) {
        duongDan=endpointBE+`/sach/search/findByDanhSachTheLoai_MaTheLoai?sort=maSach,desc&size=8&page=0&maTheLoai=${maTheLoai}`
    }else  if (tuKhoaTimKiem !== '' && maTheLoai>0) {
        duongDan=endpointBE+`/sach/search/findByTenSachContainingAndDanhSachTheLoai_MaTheLoai?sort=maSach,desc&size=8&page=0&maTheLoai=${maTheLoai}&tenSach=${tuKhoaTimKiem}`
    }

    return laySach(duongDan);

}

// Lấy sách theo id (chỉ lấy thumbnail)
export async function laySachTheoMaSach(maSach: number): Promise<SachModel|null> {

    const duongDan = endpointBE+`/sach/${maSach}`;

    let ketQua: SachModel = {
        maSach: 0,
        tenSach: "",
        tenTacGia: "",
        moTa: "",
        giaBan: NaN,
        giaNiemYet: NaN,
        soLuong: NaN,
        trungBinhXepHang: NaN,
        soLuongBan: NaN,
        giamGia: NaN,
        thumbnail: "",
    }

    try {
        // Gọi phương thức request
        // Gọi API (qua fetch) đến địa chỉ ví dụ như http://localhost:8080/sach/1
        const response =  await my_request(duongDan);

        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if(response){
            ketQua = response;
            // Trả về quyển sách
            const responseImg = await layToanBoAnhCuaMotSach(response.idBook);
            const thumbnail = responseImg.filter(image => image.thumbnail);
            return {
                ...ketQua,
                thumbnail: thumbnail[0].duongDan,
            };
        }else{
            throw new Error('Sách không tồn tài!');
        }
    } catch (error) {
        console.error("Error", error);
        return null;
    }
}

export async function laySachTheoMaGioHang(maGioHang: number): Promise<SachModel | null> {
    const endpoint = endpointBE + `/gio-hang/${maGioHang}/sach`;

    try {
        // Gọi phương thức request()
        const response = await my_request(endpoint);

        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if (response) {

            // Trả về quyển sách
            return response;
        } else {
            throw new Error("Sách không tồn tại");
        }

    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}

export async function layTongSoSach(): Promise<number> {
    const endpoint = endpointBE + `/sach/lay-tong-so-sach`;
    try {
        // Gọi phương thức request()
        const response = await requestAdmin(endpoint);
        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if (response) {
            // Trả về số lượng cuốn sách
            return response;
        }
    } catch (error) {
        throw new Error("Lỗi không gọi được endpoint lấy tổng cuốn sách\n" + error);
    }
    return 0;
}

// Lấy sách theo id (lấy thumbnail, ảnh liên quan, thể loại)
export async function laySachTheoMaLienQuan(maSach: number): Promise<SachModel | null> {
    let sachResponse: SachModel = {
        maSach: 0,
        tenSach: "",
        tenTacGia: "",
        moTa: "",
        giaNiemYet: NaN,
        giaBan: NaN,
        soLuong: NaN,
        trungBinhXepHang: NaN,
        soLuongBan: NaN,
        giamGia: NaN,
        thumbnail: "",
        danhSachAnh: [],
        maTheLoai: [],
        danhSachTheLoai: [],
    }

    try {
        // Gọi phương thức request()
        const response = await laySachTheoMaSach(maSach);

        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if (response) {
            // Lưu dữ liệu sách
            sachResponse = response;

            // Lấy tất cả hình ảnh của sách
            const imagesList = await layToanBoAnhCuaMotSach(response.maSach);
            const thumbnail = imagesList.find((hinhAnh) => hinhAnh.thumbnail);
            const relatedImg = imagesList.map((hinhAnh) => {
                // Sử dụng conditional (ternary) để trả về giá trị
                return !hinhAnh.thumbnail ? hinhAnh.duongDan || hinhAnh.duLieuAnh : null;
            }).filter(Boolean); // Loại bỏ các giá trị null



            sachResponse = { ...sachResponse, danhSachAnh: relatedImg as string[], thumbnail: thumbnail?.duongDan || thumbnail?.duLieuAnh };

            // Lấy tất cả thể loại của sách
            const genresList = await layTheLoaiByMaSach(response.maSach);
            genresList.danhSachTheLoai.forEach((theLoai) => {
                const dataGenre: TheLoaiModel = { maTheLoai: theLoai.maTheLoai, tenTheLoai: theLoai.tenTheLoai };
                sachResponse = { ...sachResponse, danhSachTheLoai: [...sachResponse.danhSachTheLoai || [], dataGenre] };
            })

            return sachResponse;
        } else {
            throw new Error("Sách không tồn tại");
        }

    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}