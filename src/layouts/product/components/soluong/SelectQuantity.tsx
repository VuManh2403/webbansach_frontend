
import React from "react";
import "./SelectQuantity.css";
import CartItemModel from "../../../../model/CartItemModel";
import BookModel from "../../../../model/BookModel";
import { isToken } from "../../../../utils/JwtService";
import { endpointBE } from "../../../../utils/Constant";

interface SelectQuantityProps {
	max: number | undefined;
	setQuantity?: any;
	quantity?: number;
	add?: any;
	reduce?: any;
	book?: BookModel;
}

const SelectQuantity: React.FC<SelectQuantityProps> = (props) => {
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
			const cart: CartItemModel[] = cartData ? JSON.parse(cartData) : [];
			// cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
			let isExistBook = cart.find(
				(cartItem) => cartItem.book.idBook === props.book?.idBook
			);
			// Thêm 1 sản phẩm vào giỏ hàng
			if (isExistBook) {
				// nếu có rồi thì sẽ gán là số lượng mới
				isExistBook.quantity = newQuantity;

				// Cập nhật trong db
				if (isToken()) {
					const token = localStorage.getItem("token");
					fetch(endpointBE + `/cart-item/update-item`, {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${token}`,
							"content-type": "application/json",
						},
						body: JSON.stringify({
							idCart: isExistBook.idCart,
							quantity: isExistBook.quantity,
						}),
					}).catch((err) => console.log(err));
				}
			}
			// Cập nhật lại
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	};

	return (
		<div className="d-flex align-items-center border rounded px-2" style={{ width: "110px" }}>
			<button
				type="button"
				className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
				onClick={props.reduce}
				style={{ width: "30px", background: "transparent", border: "none" }}
			>
				<i className="fas fa-minus"></i>
			</button>

			<input
				type="number"
				className="form-control text-center p-0 m-0"
				style={{ width: "50px", border: "none", boxShadow: "none" }}
				value={props.quantity}
				onChange={handleQuantity}
				min={1}
				max={props.max}
			/>

			<button
				type="button"
				className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
				onClick={props.add}
				style={{ width: "30px", background: "transparent", border: "none" }}
			>
				<i className="fas fa-plus"></i>
			</button>
		</div>

	);
};

export default SelectQuantity;
