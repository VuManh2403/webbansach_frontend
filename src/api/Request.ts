


//async là từ khóa được dùng để khai báo một hàm bất đồng bộ (asynchronous function).
//Giúp bạn viết mã bất đồng bộ một cách rõ ràng và dễ đọc hơn, thay vì dùng callback hay promise.then() lồng nhau.
//Khi bạn đánh dấu một hàm với từ khóa async, hàm đó tự động trả về một Promise.
 import {kiemTraTokenHetHan} from "../layouts/utils/JwtService";

export async function my_request(duongDan: string) {

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

export async function requestAdmin(endpoint: string) {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }
    if (!kiemTraTokenHetHan(token)) {
        return;
    }
    // Truy cập đến đường dẫn
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Thất bại
    if (!response.ok) {
        throw new Error(`Không thể truy cập ${endpoint}`);
    }

    // Thành công
    return response.json();
}