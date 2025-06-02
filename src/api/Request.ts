import { isTokenExpired } from "../utils/JwtService";


export async function request(endpoint: string) {
    // Truy cập đến đường dẫn
    // Ở đây, fetch(endpoint) là một thao tác bất đồng bộ — nên bạn dùng await để chờ nó hoàn thành, rồi mới lưu vào biến response
    //  Nếu không dùng await, response sẽ là một Promise, chưa có dữ liệu thật.
    const response = await fetch(endpoint);

    // Thất bại
    if (!response.ok) {
        throw new Error(`Không thể truy cập ${endpoint}`);
    }

    // Thành công
    return response.json();
}

export async function requestAdmin(endpoint: string) {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }
    if (!isTokenExpired(token)) {
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