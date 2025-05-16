import React, {useEffect, useState} from "react";
import BookModel from "../../../model/BookModel";
import ImageModel from "../../../model/ImageModel";
import {getAllImageByBook} from "../../../api/ImageApi";



interface CarouselItemInterface{
    book: BookModel;
}

const CarouselItem: React.FC<CarouselItemInterface> = (props) => {

    const maSach:number = props.book.idBook;

    const [danhSachAnh, setDanhSachAnh] = useState<ImageModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // lay du lieu
    useEffect(() => {

            getAllImageByBook(maSach).then(
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
    if(danhSachAnh[0] && danhSachAnh[0].urlImage){
        duLieuAnh=danhSachAnh[0].urlImage;
    }

    return (
        <div className="row align-items-center">
            <div className="col-5 text-center">
                <img src={duLieuAnh} className="float-end" style={{width:'150px'}} />
            </div>
            <div className="col-7">
                <h5>{props.book.nameBook}</h5>
            </div>
        </div>
    );
}
export default CarouselItem;