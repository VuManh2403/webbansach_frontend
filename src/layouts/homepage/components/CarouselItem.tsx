import React, {useEffect, useState} from "react";
import SachModel from "../../../model/SachModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import {lay1AnhCuaMotSach} from "../../../api/HinhAnhAPI";
import { error } from "console";


interface CarouselItemInterface{
    sach: SachModel;
}

const CarouselItem: React.FC<CarouselItemInterface> = (props) => {

    const maSach:number = props.sach.maSach;

    const [danhSachAnh, setDanhSachAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // lay du lieu
    useEffect(() => {

            lay1AnhCuaMotSach(maSach).then(
                hinhAnhData =>{
                    setDanhSachAnh(hinhAnhData);
                    setDangTaiDuLieu(false);
                }
            ).catch(
                error => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                }
            );

        },[] // chi goi 1 lan neu ko co luc nao cx truy van du lieu
    )


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

    let duLieuAnh:string="";
    if(danhSachAnh[0] && danhSachAnh[0].duLieuAnh){
        duLieuAnh=danhSachAnh[0].duLieuAnh;
    }

    return (
        <div className="row align-items-center">
            <div className="col-5 text-center">
                <img src={duLieuAnh} className="float-end" style={{width:'150px'}} />
            </div>
            <div className="col-7">
                <h5>{props.sach.tenSach}</h5>
            </div>
        </div>
    );
}
export default CarouselItem;