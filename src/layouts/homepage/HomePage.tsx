import React from 'react';
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import DanhSachSanPham from "../product/DanhSachSanPham";

interface HomePageProps{
    tuKhoaTimKiem: string
}

function HomePage({tuKhoaTimKiem}: HomePageProps) {
    return(
      <div>
          <Banner></Banner>
          <Carousel></Carousel>
          <DanhSachSanPham tuKhoaTimKiem={tuKhoaTimKiem}></DanhSachSanPham>
      </div>
    );
}

export default HomePage;