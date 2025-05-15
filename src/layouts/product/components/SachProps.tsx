import React, {useEffect, useState} from "react";
import SachModel from "../../../model/SachModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import {Link, useNavigate} from "react-router-dom";
import {useGioHang} from "../../utils/QuanLyGioHang";
import {kiemTraToken, layMaNguoiDungByToken} from "../../utils/JwtService";
import {endpointBE} from "../../utils/Constant";
import {toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import TextEllipsis from "./ngatvanbanbangdau3cham/TextEllipsis";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface SachPropsInterface{
    sach: SachModel;
}

const SachProps: React.FC<SachPropsInterface> = (props) => {


    const [danhSachAnh, setDanhSachAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    const { setTongSoSanPham, danhSachGioHang } = useGioHang();
    const [isFavoriteBook, setIsFavoriteBook] = useState(false);
    const navigation = useNavigate();

    // Lấy tất cả sách yêu thích của người dùng đã đăng nhập ra
    useEffect(() => {
        if (kiemTraToken()) {
            fetch(
                endpointBE + `/yeu-thich/lay-sach-yeu-thich/${layMaNguoiDungByToken()}`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.includes(props.sach.maSach)) {
                        setIsFavoriteBook(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);



    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddProduct = async (newBook: SachModel) => {
        // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
        let isExistBook = danhSachGioHang.find(
            (cartItem) => cartItem.sach.maSach === newBook.maSach
        );
        // Thêm 1 sản phẩm vào giỏ hàng
        if (isExistBook) {
            // nếu có rồi thì sẽ tăng số lượng
            isExistBook.soLuong += 1;

            // Lưu vào db
            if (kiemTraToken()) {
                const request = {
                    maGioHang: isExistBook.maGioHang,
                    soLuong: isExistBook.soLuong,
                };
                const token = localStorage.getItem("token");
                fetch(endpointBE + `/chi-tiet-gio-hang/cap-nhap-gio-hang`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(request),
                }).catch((err) => console.log(err));
            }
        } else {
            // Lưu vào db
            if (kiemTraToken()) {
                try {
                    const request = [
                        {
                            soLuong: 1,
                            sach: newBook,
                            maNguoiDung: layMaNguoiDungByToken(),
                        },
                    ];
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                        endpointBE + "/chi-tiet-gio-hang/them-gio-hang",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(request),
                        }
                    );

                    if (response.ok) {
                        const idCart = await response.json();
                        danhSachGioHang.push({
                            maGioHang: idCart,
                            soLuong: 1,
                            sach: newBook,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                danhSachGioHang.push({
                    soLuong: 1,
                    sach: newBook,
                });
            }
        }
        // Lưu vào localStorage
        localStorage.setItem("cart", JSON.stringify(danhSachGioHang));
        // Thông báo toast
        toast.success("Thêm vào giỏ hàng thành công");
        setTongSoSanPham(danhSachGioHang.length);
    };

    // Xử lý chức năng yêu sách
    const handleFavoriteBook = async (newBook: SachModel) => {
        if (!kiemTraToken()) {
            toast.info("Bạn phải đăng nhập để sử dụng chức năng này");
            navigation("/login");
            return;
        }
        if (!isFavoriteBook) {
            const token = localStorage.getItem("token");
            fetch(endpointBE + `/yeu-thich/them-sach-yeu-thich`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    maSach: props.sach.maSach,
                    maNguoiDung: layMaNguoiDungByToken(),
                }),
            }).catch((err) => console.log(err));
        } else {
            const token = localStorage.getItem("token");
            fetch(endpointBE + `/yeu-thich/xoa-sach-yeu-thich`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    maSach: props.sach.maSach,
                    maNguoiDung: layMaNguoiDungByToken(),
                }),
            }).catch((err) => console.log(err));
        }
        setIsFavoriteBook(!isFavoriteBook);
    };


    return (
        <div className='col-md-6 col-lg-3 mt-3'>
            <div className='card position-relative'>
                {props.sach.giamGia !== 0 && (
                    <h4
                        className='my-0 d-inline-block position-absolute end-0'
                        style={{ top: "15px" }}
                    >
                        {props.sach.soLuong === 0 ? (
                            <span className='badge bg-danger'>Hết hàng</span>
                        ) : (
                            <span className='badge bg-primary'>
								{props.sach.giamGia}%
							</span>
                        )}
                    </h4>
                )}
                <Link to={`/sach/${props.sach.maSach}`}>
                    <img
                        src={props.sach.thumbnail}
                        className='card-img-top mt-3'
                        alt={props.sach.tenSach}
                        style={{ height: "300px" }}
                    />
                </Link>
                <div className='card-body'>
                    <Link
                        to={`/sach/${props.sach.maSach}`}
                        style={{ textDecoration: "none" }}
                    >
                        <h5 className='card-title'>
                            <Tooltip title={props.sach.tenSach} arrow>
								<span>
									<TextEllipsis text={props.sach.tenSach + ""} limit={20} />
								</span>
                            </Tooltip>
                        </h5>
                    </Link>
                    <div className='price mb-3 d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.sach.giaBan?.toLocaleString()}đ
								</strong>
							</span>
                            {props.sach.giamGia !== 0 && (
                                <span className='original-price ms-3 small fw-bolder'>
									<del>{props.sach.giaNiemYet?.toLocaleString()}đ</del>
								</span>
                            )}
                        </div>
                        <span
                            className='ms-2'
                            style={{ fontSize: "12px", color: "#aaa" }}
                        >
							Đã bán {props.sach.soLuongBan}
						</span>
                    </div>
                    <div className='row mt-2' role='group'>
                        <div className='col-6'>
                            <Tooltip title='Yêu thích'>
                                <IconButton
                                    size='small'
                                    color={isFavoriteBook ? "error" : "default"}
                                    onClick={() => {
                                        handleFavoriteBook(props.sach);
                                    }}
                                >
                                    <FavoriteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className='col-6'>
                            {props.sach.soLuong !== 0 && (
                                <Tooltip title='Thêm vào giỏ hàng'>
                                    <button
                                        className='btn btn-primary btn-block'
                                        onClick={() => handleAddProduct(props.sach)}
                                    >
                                        <i className='fas fa-shopping-cart'></i>
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SachProps;