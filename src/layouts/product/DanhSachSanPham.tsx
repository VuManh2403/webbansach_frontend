import React, {useEffect, useState} from 'react';
import SachModel from "../../model/SachModel";
import SachProps from "./components/SachProps";
import {layToanBoSach, timKiemSach} from "../../api/SachAPI";
import { error } from "console";
import {PhanTrang} from "../Utils/PhanTrang";

interface DanhSachSanPhamProps {
    tuKhoaTimKiem: string;
}

function DanhSachSanPham({ tuKhoaTimKiem }: DanhSachSanPhamProps) {

    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<SachModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // phan trang
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const [tongSOSach, setTongSoSach] = useState(0);

    // lay du lieu
    useEffect(() => {
        if (tuKhoaTimKiem === '') {
            layToanBoSach(trangHienTai - 1).then(
                kq => {
                    setDanhSachQuyenSach(kq.ketQua);
                    setTongSoTrang(kq.tongSoTrang);
                    setDangTaiDuLieu(false);
                }
            ).catch(
                error => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                }
            );
        }else{
            timKiemSach(tuKhoaTimKiem).then(
                kq => {
                    setDanhSachQuyenSach(kq.ketQua);
                    setTongSoTrang(kq.tongSoTrang);
                    setDangTaiDuLieu(false);
                }
            ).catch(
                error => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                }
            );
        }
    }, [trangHienTai, tuKhoaTimKiem]); // khi noi dung trong ngoac [] thay doi thi lam useEffect se thay doi


    const phanTrang = (trang: number) => {
        setTrangHienTai(trang);
    };

    if(dangTaiDuLieu){
        return (
          <div>
              <h1>Đang tải dữ liệu...</h1>
          </div>
        );
    }

    if (baoLoi) {
        return(
            <div>
                <h1>Gặp lỗi: {baoLoi}</h1>
            </div>
        );
    }

    if(danhSachQuyenSach.length===0){
        return (
            <div className="container">
                <div className="d-flex align-items-center justify-content-center">
                    <h1>Hiện không tìm thấy sách theo yêu cầu!</h1>
                </div>
            </div>
        );
    }

    return (


        <div className="container">
            <div className="row mt-4 mb-4">
                {
                    danhSachQuyenSach.map((sach) => (
                            <SachProps key={sach.maSach} sach={sach} />
                        )
                    )
                }
            </div>
            <PhanTrang trangHienTai={trangHienTai} tongSoTrang={tongSoTrang} phanTrang={phanTrang}></PhanTrang>
        </div>
    );
}

export default DanhSachSanPham;
