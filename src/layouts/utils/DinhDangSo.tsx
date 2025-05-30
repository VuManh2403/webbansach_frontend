function dinhDangSo(x: number|undefined){
    if(x===undefined){
        return 0;
    }
    // loi khong xac dinh
    if(isNaN(x)){
        return 0;
    }
    // Sử dụng hàm toLocaleString để định dạng số
    return x.toLocaleString("vi-VN");
}

export default dinhDangSo;