import React, {useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SachModel from "../../model/SachModel";
import {laySachTheoMaSach} from "../../api/SachAPI";
import {useGioHang} from "../utils/QuanLyGioHang";
import TheLoaiModel from "../../model/TheLoaiModel";
import {layTheLoaiByMaSach} from "../../api/TheLoaiAPI";
import HinhAnhModel from "../../model/HinhAnhModel";
import {layToanBoAnhCuaMotSach} from "../../api/HinhAnhAPI";
import {kiemTraToken, layMaNguoiDungByToken} from "../utils/JwtService";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import GioHangModel from "../../model/GioHangModel";
import {Button, Skeleton } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import TextEllipsis from "./components/ngatvanbanbangdau3cham/TextEllipsis";
import ChonSoLuong from "./components/soluong/ChonSoLuong";

const ChiTietSanPham: React.FC = () => {
    const { setTongSoSanPham, danhSachGioHang } = useGioHang();

    // Lấy mã sách từ url
    const { maSach } = useParams();
    let idBookNumber: number = 0;

    // Ép kiểu về number
    try {
        idBookNumber = parseInt(maSach + "");
        if (Number.isNaN(idBookNumber)) {
            idBookNumber = 0;
        }
    } catch (error) {
        console.error("Error: " + error);
    }

    // Khai báo biến
    const [book, setBook] = useState<SachModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [erroring, setErroring] = useState(null);
    // Lấy sách ra
    useEffect(() => {
        laySachTheoMaSach(idBookNumber)
            .then((response) => {
                setBook(response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setErroring(error.message);
            });
    }, []);

    // Lấy ra thể loại của sách
    const [genres, setGenres] = useState<TheLoaiModel[] | null>(null);
    useEffect(() => {
        layTheLoaiByMaSach(idBookNumber).then((response) => {
            setGenres(response.danhSachTheLoai);
        });
    }, []);

    // Lấy ra hình ảnh của sách
    const [images, setImages] = useState<HinhAnhModel[] | null>(null);
    useEffect(() => {
        layToanBoAnhCuaMotSach(idBookNumber)
            .then((response) => {
                setImages(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const [quantity, setQuantity] = useState(1);
    // Xử lý tăng số lượng
    const add = () => {
        if (quantity < (book?.soLuong ? book?.soLuong : 1)) {
            setQuantity(quantity + 1);
        }
    };

    // Xử lý giảm số lượng
    const reduce = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddProduct = async (newBook: SachModel) => {
        // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
        let isExistBook = danhSachGioHang.find(
            (cartItem) => cartItem.sach.maSach === newBook.maSach
        );
        // Thêm 1 sản phẩm vào giỏ hàng
        if (isExistBook) {
            // nếu có rồi thì sẽ tăng số lượng
            isExistBook.soLuong += quantity;

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
                            soLuong: quantity,
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
                            soLuong: quantity,
                            sach: newBook,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                danhSachGioHang.push({
                    soLuong: quantity,
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

    // Viewer hình ảnh
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    let imageList: string[] = [];
    if (images !== undefined && images !== null) {
        imageList = images.map((image) => {
            return image.duongDan || image.duLieuAnh;
        }) as string[];
    }

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const [isCheckout, setIsCheckout] = useState(false);
    const [cartItem, setCartItem] = useState<GioHangModel[]>([]);
    const [totalPriceProduct, setTotalPriceProduct] = useState(0);
    function handleBuyNow(newBook: SachModel) {
        setCartItem([{ soLuong:quantity, sach: newBook }]);
        setIsCheckout(!isCheckout);
        setTotalPriceProduct(newBook.giaBan * quantity);
    }

    if (loading) {
        return (
            <div className='container-book container mb-5 py-5 px-5 bg-light'>
                <div className='row'>
                    <div className='col-4'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-8 px-5'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={100}
                        />
                        <Skeleton className='my-3' variant='rectangular' />
                        <Skeleton className='my-3' variant='rectangular' />
                        <Skeleton className='my-3' variant='rectangular' />
                    </div>
                </div>
            </div>
        );
    }

    if (erroring) {
        return (
            <div>
                <h1>Gặp lỗi: {erroring}</h1>
            </div>
        );
    }

    if (book === null) {
        return (
            <div>
                <h1>Sách không tồn tại </h1>
            </div>
        );
    }

    return (
        <>
            {!isCheckout ? (
                <>
                    <div className='container p-2 bg-white my-3 rounded'>
                        <div className='row mt-4 mb-4'>
                            <div className='col-lg-4 col-md-4 col-sm-12'>
                                <Carousel
                                    emulateTouch={true}
                                    swipeable={true}
                                    showIndicators={false}
                                >
                                    {images?.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => openImageViewer(index)}
                                            style={{
                                                width: "100%",
                                                height: "400px",
                                                objectFit: "cover",
                                            }}
                                        >
                                            <img
                                                alt=''
                                                src={
                                                    image.duLieuAnh
                                                        ? image.duLieuAnh
                                                        : image.duongDan
                                                }
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                                {isViewerOpen && (
                                    <ReactSimpleImageViewer
                                        src={imageList}
                                        currentIndex={currentImage}
                                        disableScroll={true}
                                        closeOnClickOutside={true}
                                        onClose={closeImageViewer}
                                        backgroundStyle={{
                                            backgroundColor: "rgba(0,0,0,0.7)",
                                        }}
                                    />
                                )}
                            </div>
                            <div className='col-lg-8 col-md-8 col-sm-12 px-5'>
                                <h2>{book.tenSach}</h2>
                                <div className='d-flex align-items-center'>
                                    <p className='me-5'>
                                        Thể loại:{" "}
                                        <strong>
                                            {genres?.map((genre) => genre.nameGenre + " ")}
                                        </strong>
                                    </p>
                                    <p className='ms-5'>
                                        Tác giả: <strong>{book.tenTacGia}</strong>
                                    </p>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <div className='d-flex align-items-center'>
                                        <RatingStar
                                            readonly={true}
                                            ratingPoint={book.trungBinhXepHang}
                                        />

                                        <p className='text-danger ms-2 mb-0'>
                                            ({book.trungBinhXepHang})
                                        </p>
                                    </div>
                                    <div className='d-flex align-items-center'>
										<span className='mx-3 mb-1 text-secondary'>
											|
										</span>
                                    </div>
                                    <div className='d-flex align-items-end justify-content-center '>
										<span
                                            style={{
                                                color: "rgb(135,135,135)",
                                                fontSize: "16px",
                                            }}
                                        >
											Đã bán
										</span>
                                        <span className='fw-bold ms-2'>
											{book.soLuongBan}
										</span>
                                    </div>
                                </div>
                                <div className='price'>
									<span className='discounted-price text-danger me-3'>
										<strong style={{ fontSize: "32px" }}>
											{book.giaBan?.toLocaleString()}đ
										</strong>
									</span>
                                    <span className='original-price small me-3'>
										<strong>
											<del>{book.giaNiemYet?.toLocaleString()}đ</del>
										</strong>
									</span>
                                    <h4 className='my-0 d-inline-block'>
										<span className='badge bg-danger'>
											{book.giamGia}%
										</span>
                                    </h4>
                                </div>
                                <div className='mt-3'>
                                    <p>
                                        Vận chuyển tới:{" "}
                                        <strong>Hà Nội</strong>{" "}
                                        <span
                                            className='ms-3 text-primary'
                                            style={{ cursor: "pointer" }}
                                        >
											Thay đổi
										</span>
                                    </p>
                                    <div className='d-flex align-items-center mt-3'>
                                        <img
                                            src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/d9e992985b18d96aab90969636ebfd0e.png'
                                            height='20'
                                            alt='free ship'
                                        />
                                        <span className='ms-3'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mt-3'>
                                    <strong className='me-5'>Số lượng: </strong>
                                    < ChonSoLuong
                                        max={book.soLuong}
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                        add={add}
                                        reduce={reduce}
                                    />
                                    <span className='ms-4'>
										{book.soLuong} sản phẩm có sẵn
									</span>
                                </div>
                                <div className='mt-4 d-flex align-items-center'>
                                    {book.soLuong === 0 ? (
                                        <Button
                                            variant='outlined'
                                            size='large'
                                            className='me-3'
                                            color='error'
                                        >
                                            Hết hàng
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant='outlined'
                                                size='large'
                                                startIcon={<ShoppingCartOutlined />}
                                                className='me-3'
                                                onClick={() => handleAddProduct(book)}
                                            >
                                                Thêm vào giỏ hàng
                                            </Button>
                                            <Button
                                                variant='contained'
                                                size='large'
                                                className='ms-3'
                                                onClick={() => handleBuyNow(book)}
                                            >
                                                Mua ngay
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container p-4 bg-white my-3 rounded'>
                        <h5 className='my-3'>Mô tả sản phẩm</h5>
                        <hr />
                        <TextEllipsis
                            isShow={true}
                            text={book.moTa + ""}
                            limit={1000}
                        />
                    </div>
                    <div className='container p-4 bg-white my-3 rounded'>
                        <h5 className='my-3'>Khách hàng đánh giá</h5>
                        <hr />
                        <Comment idBook={idBookNumber} />
                    </div>
                </>
            ) : (
                <CheckoutPage
                    setIsCheckout={setIsCheckout}
                    cartList={cartItem}
                    totalPriceProduct={totalPriceProduct}
                    isBuyNow={true}
                />
            )}
        </>
    );
};
export default ChiTietSanPham;