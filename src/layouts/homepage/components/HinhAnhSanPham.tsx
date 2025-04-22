import React, { useEffect, useState } from "react";
import {layToanBoAnhCuaMotSach} from "../../../api/HinhAnhAPI";
import HinhAnhModel from "../../../model/HinhAnhModel";

interface HinhAnhSanPham {
    maSach: number;
}

const HinhAnhSanPham: React.FC<HinhAnhSanPham> = (props) => {

    const maSach: number = props.maSach;

    const [danhSachAnh, setDanhSachAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);
    const [hinhAnhDangChon, setHinhAnhDangChon] = useState<HinhAnhModel | null>(null);

    const chonAnh = (hinhAnh: HinhAnhModel) => {
        setHinhAnhDangChon(hinhAnh);
    }

    useEffect(() => {
            layToanBoAnhCuaMotSach(maSach).then(
                danhSach => {
                    setDanhSachAnh(danhSach);
                    if (danhSach.length > 0) {
                        setHinhAnhDangChon(danhSach[0]);
                    }
                    setDangTaiDuLieu(false);
                }
            ).catch(
                error => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                }
            );
        }, [] // Chi goi mot lan
    )



    // console.log(danhSachAnh.length);

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

    return (
        <div className="row">
            <div>
                {(hinhAnhDangChon) && <img src={hinhAnhDangChon.duLieuAnh} />}
            </div>
            <div className="row mt-2">
                {
                    danhSachAnh.map((hinhAnh, index) => (
                        <div className={"col-3"} key={index}>
                            <img onClick={() => chonAnh(hinhAnh)} src={hinhAnh.duLieuAnh} style={{ width: '50px' }} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
export default HinhAnhSanPham;