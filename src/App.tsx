import React, {useState} from 'react';
import './App.css';
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import About from "./layouts/about/About";
import ChiTietSanPham from "./layouts/product/ChiTietSanPham";
import DangKyNguoiDung from "./layouts/user/DangKyNguoiDung";
import KichHoatTaiKhoan from "./layouts/user/KichHoatTaiKhoan";
import DangNhap from "./layouts/user/DangNhap";
import Test from "./layouts/user/Test";
import SachForm from "./layouts/admin/SachForm";
import {Error403Page} from "./layouts/homepage/403Page";
import {Error404Page} from "./layouts/homepage/404Page";
import ChinhSach from "./layouts/homepage/ChinhSach";
import GioiThieu from "./layouts/homepage/GioiThieu";

function App() {
    // dung useState de tao ra bien
    // bien se anh huong den Navbar, HomePage
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

    return (
        <div className='App'>
            <BrowserRouter>
                <Navbar tuKhoaTimKiem={tuKhoaTimKiem}  setTuKhoaTimKiem={setTuKhoaTimKiem}/>
                <Routes>
                    <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />}></Route>
                    <Route path='/:maTheLoai' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                    <Route path='/about' element={<About />}></Route>
                    <Route path='/sach/:maSach' element={<ChiTietSanPham />} />
                    <Route path='/dang-ky' element={<DangKyNguoiDung />}></Route>
                    <Route path='/kich-hoat/:email/:maKichHoat' element={<KichHoatTaiKhoan/>} />
                    <Route path='/dang-nhap' element={<DangNhap />} />
                    <Route path='/test' element={<Test />} />
                    <Route path='/admin/them-sach' element={<SachForm />} />
                    <Route path='/bao-loi-403' element={<Error403Page />} />
                    <Route path='/bao-loi-404' element={<Error404Page />} />
                    <Route path='/chinh-sach' element={<ChinhSach />} />
                    <Route path='/gioi-thieu' element={<GioiThieu />} />
                </Routes>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}

export default App;
