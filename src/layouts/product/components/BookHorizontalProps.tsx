import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Button, Chip } from "@mui/material";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import DoneIcon from "@mui/icons-material/Done";
import { FadeModal } from "../../utils/FadeModal";
import { Link } from "react-router-dom";
import GioHangModel from "../../../model/GioHangModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import {layToanBoAnhCuaMotSach} from "../../../api/HinhAnhAPI";
import TextEllipsis from "./ngatvanbanbangdau3cham/TextEllipsis";
import { DanhGiaForm } from "../DanhGia/DanhGiaForm";

interface BookHorizontalProps {
	cartItem: GioHangModel;
	type?: any;
	idOrder?: number;
	handleCloseModalOrderDetail?: any;
	statusOrder?: string;
}

export const BookHorizontal: React.FC<BookHorizontalProps> = (props) => {
	// Mở/Đóng modal
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const [cartItem, setCartItem] = useState<GioHangModel>(props.cartItem);

	const [imageList, setImageList] = useState<HinhAnhModel[]>([]);
	// Lấy ảnh ra từ BE
	useEffect(() => {
		layToanBoAnhCuaMotSach(props.cartItem.sach.maSach)
			.then((response) => {
				setImageList(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [props.cartItem.sach.maSach]);
	// Loading ảnh thumbnail
	let dataImage;
	if (imageList[0]) {
		const thumbnail = imageList.filter((i) => i.thumbnail);
		dataImage = thumbnail[0].duongDan || thumbnail[0].duLieuAnh;
	}
	return (
		<div className='row'>
			<div className='col'>
				<div className='d-flex'>
					<img
						src={dataImage}
						className='card-img-top'
						alt={props.cartItem.sach.tenSach}
						style={{ width: "100px" }}
					/>
					<div className='d-flex flex-column pb-2'>
						<Tooltip title={props.cartItem.sach.tenSach} arrow>
							<Link
								to={`/book/${props.cartItem.sach.maSach}`}
								className='d-inline text-black'
							>
								<TextEllipsis
									text={props.cartItem.sach.tenSach + " "}
									limit={100}
								/>
							</Link>
						</Tooltip>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.cartItem.sach.giaBan.toLocaleString()}đ
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{props.cartItem.sach.giaNiemYet.toLocaleString()}đ
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-2 text-center'>
				<strong>{props.cartItem.soLuong}</strong>
			</div>
			<div className='col-2 text-center'>
				<span className='text-danger'>
					<strong>
						{(
							props.cartItem.soLuong * props.cartItem.sach.giaBan
						).toLocaleString()}
						đ
					</strong>
				</span>
			</div>
			{props.type === "view-customer" &&
				props.statusOrder === "Thành công" && (
					<div className='d-flex flex-row-reverse'>
						{props.cartItem.danhGia === false ? (
							<>
								<Button
									variant='outlined'
									size='small'
									startIcon={<RateReviewRoundedIcon />}
									style={{ width: "150px" }}
									onClick={handleOpenModal}
								>
									Viết đánh giá
								</Button>
							</>
						) : (
							<>
								<Button
									className='mx-3'
									variant='outlined'
									size='small'
									startIcon={<RateReviewRoundedIcon />}
									style={{ width: "150px" }}
									onClick={handleOpenModal}
								>
									Xem đánh giá
								</Button>
								<Chip
									color='primary'
									label='Bạn đã đánh giá sản phẩm này rồi'
									icon={<DoneIcon />}
								/>
							</>
						)}
						<FadeModal
							open={openModal}
							handleOpen={handleOpenModal}
							handleClose={handleCloseModal}
						>
							<DanhGiaForm
								idOrder={props.idOrder ? props.idOrder : 0}
								idBook={props.cartItem.sach.maSach}
								handleCloseModal={handleCloseModal}
								handleCloseModalOrderDetail={
									props.handleCloseModalOrderDetail
								}
								cartItem={cartItem}
								setCartItem={setCartItem}
							/>
						</FadeModal>
					</div>
				)}
			<hr className='mt-3' />
		</div>
	);
};
