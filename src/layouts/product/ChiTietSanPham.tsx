import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SachModel from "../../model/SachModel";
import {laySachTheoMaSach} from "../../api/SachAPI";
import HinhAnhSanPham from "../homepage/components/HinhAnhSanPham";
import DanhGiaSanPham from "../homepage/components/DanhGiaSanPham";
import renderRating from "../Utils/SaoXepHang";
import dinhDangSo from "../Utils/DinhDangSo";

const ChiTietSanPham: React.FC = () => {
    // Lấy mã sách từ URL
    const { maSach } = useParams();

    // Chuyển đổi mã sách thành số nguyên
    let maSachNumber = 0;
    try {
        maSachNumber = parseInt(maSach + '');
        // ep kieu cx co the bi loi NaN (loi khong xac dinh)
        if (Number.isNaN(maSachNumber))
            maSachNumber = 0;
    } catch (error) {
        maSachNumber = 0;
        console.error("Error", error);
    }

    // Khai báo
    const [sach, setSach] = useState<SachModel | null>(null);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);


    useEffect(() => {
            laySachTheoMaSach(maSachNumber)
                .then((sach) => {
                        setSach(sach);
                        setDangTaiDuLieu(false);
                    }
                )
                .catch((error) => {
                    setBaoLoi(error.message);
                    setDangTaiDuLieu(false);
                })
        }, [maSach, maSachNumber]
    )

    if (dangTaiDuLieu) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }

    if (baoLoi) {
        return (
            <div>
                <h1>Gặp lỗi: {baoLoi}</h1>
            </div>
        );
    }

    if (!sach) {
        return (
            <div>
                <h1>Sách không tồn tại!</h1>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row mt-4 mb-4">
                <div className="col-4">
                    <HinhAnhSanPham maSach={maSachNumber}/>
                </div>
                <div className="col-8">
                    <div className="row">
                        <div className="col-8">
                            <h1>
                                {sach.tenSach}
                            </h1>
                            <h4>
                                {renderRating(sach.trungBinhXepHang?sach.trungBinhXepHang:0)}
                            </h4>
                            <h4>
                                {dinhDangSo(sach.giaBan)} đ
                            </h4>
                            <hr/>
                            <div dangerouslySetInnerHTML={{__html: (sach.moTa+'')}}/>
                            <hr/>
                        </div>
                        <div className="col-4">

                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <DanhGiaSanPham maSach={maSachNumber} />
            </div>
        </div>
    );
}
export default ChiTietSanPham;