import React, {useEffect, useState} from "react";
import SachModel from "../../../model/SachModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import {layToanBoAnhCuaMotSach} from "../../../api/HinhAnhAPI";
import { error } from "console";


interface SachPropsInterface{
    sach: SachModel;
}

const SachProps: React.FC<SachPropsInterface> = (props) => {

    const maSach:number = props.sach.maSach;

    const [danhSachAnh, setDanhSachAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // lay du lieu
    useEffect(() => {

            layToanBoAnhCuaMotSach(maSach).then(
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
        <div className="col-md-3 mt-2">
            <div className="card">
                <img
                    src={duLieuAnh}
                    className="card-img-top"
                    alt={props.sach.tenSach}
                    style={{ height: '300px' }}
                />
                <div className="card-body">
                    <h5 className="card-title">{props.sach.tenSach}</h5>
                    <p className="card-text">{props.sach.moTa}</p>
                    <div className="price">
                        <span className="original-price">
                            <del>{props.sach.giaNiemYet}</del>
                        </span>
                        <div>
                        <span className="discounted-price">
                            <strong>{props.sach.giaBan}</strong>
                        </span></div>
                    </div>
                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            <a href="#" className="btn btn-secondary btn-block">
                                <i className="fas fa-heart"></i>
                            </a>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-danger btn-block">
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SachProps;