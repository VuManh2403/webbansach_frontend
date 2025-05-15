/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../products/Book.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Skeleton} from "@mui/material";
import SachModel from "../../model/SachModel";
import {layToanBoSach, timKiemSach} from "../../api/SachAPI";
import SachProps from "./components/SachProps";
import {PhanTrang} from "../utils/PhanTrang";

interface DanhSachSanPhamProps {
    paginable?: boolean;
    size?: number;
    keySearch?: string | undefined;
    idGenre?: number;
    filter?: number;
}

const DanhSachSanPham: React.FC<DanhSachSanPhamProps> = (props) => {
    const [bookList, setDanhSachSanPham] = useState<SachModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erroring, setErroring] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // const [totalBook, setTotalBook] = useState(0);

    // Xử lý phân trang
    const handlePagination = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Chỗ này xử lý khi thực hiện chức năng hiện số sản phẩm
    const [totalPagesTemp, setTotalPagesTemp] = useState(totalPages);
    if (totalPagesTemp !== totalPages) {
        setCurrentPage(1);
        setTotalPagesTemp(totalPages);
    }

    useEffect(() => {
        // Mặc đinh sẽ gọi getAllBook
        if (
            (props.keySearch === "" &&
                props.idGenre === 0 &&
                props.filter === 0) ||
            props.keySearch === undefined
        ) {
            // currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
            layToanBoSach(props.size, currentPage - 1) // size là (tổng sản phẩm được hiện)
                .then((response) => {
                    setDanhSachSanPham(response.danhSachSach);
                    setTotalPages(response.tongSoTrang);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    setErroring(error.message);
                });
        } else {
            // Khi có các param lọc
            timKiemSach(
                props.keySearch,
                props.idGenre,
                props.filter,
                props.size,
                currentPage - 1
            )
                .then((response) => {
                    setDanhSachSanPham(response.danhSachSach);
                    setTotalPages(response.tongSoTrang);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    setErroring(error.message);
                });
        }
    }, [currentPage, props.keySearch, props.idGenre, props.filter, props.size]);

    if (loading) {
        return (
            <div className='container-book container mb-5 py-5 px-5 bg-light'>
                <div className='row'>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
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

    // Kiểm tra danh sách sách xem có phần tử nào không
    if (bookList.length === 0) {
        return (
            <div className='container-book container mb-5 px-5 px-5 bg-light'>
                <h2 className='mt-4 px-3 py-3 mb-0'>
                    Không tìm thấy sách! "{props.keySearch}"
                </h2>
            </div>
        );
    }

    return (
        <div className='container-book container mb-5 pb-5 px-5 bg-light'>
            {!props.paginable && (
                <>
                    <h2 className='mt-4 px-3 py-3 mb-0'>TẤT CẢ</h2>
                    <hr className='mt-0' />
                </>
            )}
            <div className='row'>
                {bookList.map((book) => (
                    <SachProps key={book.maSach} sach={book} />
                ))}
            </div>
            {props.paginable ? (
                <>
                    <hr className='mt-5' style={{ color: "#aaa" }} />
                    <PhanTrang
                        trangHienTai={currentPage}
                        tongSoTrang={totalPages}
                        phanTrang={handlePagination}
                    />
                </>
            ) : (
                <Link to={"/search"}>
                    <div className='d-flex align-items-center justify-content-center'>
                        <Button
                            variant='outlined'
                            size='large'
                            className='text-primary mt-5 w-25'
                        >
                            Xem Thêm
                        </Button>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default DanhSachSanPham;
