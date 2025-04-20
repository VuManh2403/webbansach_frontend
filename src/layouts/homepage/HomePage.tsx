import React from 'react';
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import DanhSachSanPham from "../product/DanhSachSanPham";
import {useParams} from "react-router-dom";

interface HomePageProps{
    tuKhoaTimKiem: string
}

function HomePage({tuKhoaTimKiem}: HomePageProps) {

    // lay ra maTheLoai
    const {maTheLoai} = useParams();
    // co the luc lay ra no la chu hoac ko co -> dang so
    let maTheLoaiNumber = 0;
    try {
        maTheLoaiNumber = parseInt(maTheLoai+''); // NaN
    } catch (error) {
        maTheLoaiNumber = 0;
        console.error('Error: ', error);
    }
    if(Number.isNaN(maTheLoaiNumber))
        maTheLoaiNumber = 0;

    return(
      <div>
          <Banner></Banner>
          <Carousel></Carousel>
          <DanhSachSanPham tuKhoaTimKiem={tuKhoaTimKiem} maTheLoai={maTheLoaiNumber}></DanhSachSanPham>
      </div>
    );
}

export default HomePage;