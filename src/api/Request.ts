//async là từ khóa được dùng để khai báo một hàm bất đồng bộ (asynchronous function).
//Giúp bạn viết mã bất đồng bộ một cách rõ ràng và dễ đọc hơn, thay vì dùng callback hay promise.then() lồng nhau.
//Khi bạn đánh dấu một hàm với từ khóa async, hàm đó tự động trả về một Promise.
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