import CarouselItem from "./CarouselItem";
import {get3BestSellerBooks} from "../../../api/BookApi";
import {useEffect, useState} from "react";
import BookModel from "../../../model/BookModel";


const Carousel: React.FC = () =>  {

    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<BookModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // lay du lieu
    useEffect(() => {

            get3BestSellerBooks().then(
                kq =>{
                    setDanhSachQuyenSach(kq);
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

    return (
        <div>
            <div id="carouselExampleDark" className="carousel carousel-dark slide">
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="10000">
                        <CarouselItem key={0} book={danhSachQuyenSach[0]}></CarouselItem>
                    </div>
                    <div className="carousel-item " data-bs-interval="10000">
                        <CarouselItem key={1} book={danhSachQuyenSach[1]}></CarouselItem>
                    </div>
                    <div className="carousel-item " data-bs-interval="10000">
                        <CarouselItem key={2} book={danhSachQuyenSach[2]}></CarouselItem>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Carousel;