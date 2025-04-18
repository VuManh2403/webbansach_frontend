import React, {useEffect, useState} from 'react';
import SachModel from "../../model/SachModel";
import SachProps from "./components/SachProps";
import {layToanBoSach} from "../../api/SachAPI";
import { error } from "console";
import {PhanTrang} from "../Utils/PhanTrang";


const DanhSachSanPham: React.FC = () => {

    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<SachModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // phan trang
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const [tongSOSach, setTongSoSach] = useState(0);

    // lay du lieu
    useEffect(() => {

            layToanBoSach(trangHienTai-1).then(
                kq =>{
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

    },[trangHienTai] // chi goi 1 lan neu ko co luc nao cx truy van du lieu
    )

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
