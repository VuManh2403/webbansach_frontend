import React from "react";
import "./ChonSoLuong.css";
import Icon from "@mui/material/Icon";
import { endpointBE } from "../../../utils/Constant";
import SachModel from "../../../../model/SachModel";
import GioHangModel from "../../../../model/GioHangModel";
import {kiemTraToken} from "../../../utils/JwtService";

interface ChonSoLuongProps {
    max: number | undefined;
    setQuantity?: any;
    quantity?: number;
    add?: any;
    reduce?: any;
    book?: SachModel;
}

const ChonSoLuong: React.FC<ChonSoLuongProps> = (props) => {
    // Xử lý khi thay đổi input quantity bằng bàn phím
    const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (
            !isNaN(newQuantity) &&
            newQuantity >= 1 &&
            newQuantity <= (props.max ? props.max : 1)
        ) {
            props.setQuantity(newQuantity);
            const cartData: string | null = localStorage.getItem("cart");
            const cart: GioHangModel[] = cartData ? JSON.parse(cartData) : [];
            // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
            let isExistBook = cart.find(
                (cartItem) => cartItem.sach.maSach === props.book?.maSach
            );
            // Thêm 1 sản phẩm vào giỏ hàng
            if (isExistBook) {
                // nếu có rồi thì sẽ gán là số lượng mới
                isExistBook.soLuong = newQuantity;

                // Cập nhật trong db
                if (kiemTraToken()) {
                    const token = localStorage.getItem("token");
                    fetch(endpointBE + `/cart-item/update-item`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            maGioHang: isExistBook.maGioHang,
                            soLuong: isExistBook.soLuong,
                        }),
                    }).catch((err) => console.log(err));
                }
            }
            // Cập nhật lại
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    };

    return (
        <div
            className='wrapper-select-quantity d-flex align-items-center rounded'
            style={{ width: "110px" }}
        >
            <button
                type='button'
                className='d-flex align-items-center justify-content-center'
                onClick={() => props.reduce()}
                style={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                }}
            >
                <Icon>remove</Icon>
            </button>
            <input
                type='number'
                className='inp-number p-0 m-0'
                value={props.quantity}
                onChange={handleQuantity}
                min={1}
                max={props.max}
            />
            <button
                type='button'
                className='d-flex align-items-center justify-content-center'
                onClick={() => props.add()}
                style={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                }}
            >
                <Icon>add</Icon>
            </button>
        </div>
    );
};

export default ChonSoLuong;
