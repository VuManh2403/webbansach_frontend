import React, {useState} from 'react';
import './App.css';
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import About from "./layouts/about/About";
import ChiTietSanPham from "./layouts/product/ChiTietSanPham";
import DangKyNguoiDung from "./layouts/user/DangKyNguoiDung";
import KichHoatTaiKhoan from "./layouts/user/KichHoatTaiKhoan";
import DangNhap from "./layouts/user/DangNhap";
import Test from "./layouts/user/Test";
import {Error403Page} from "./layouts/homepage/403Page";
import {Error404Page} from "./layouts/homepage/404Page";
import ChinhSach from "./layouts/homepage/ChinhSach";
import GioiThieu from "./layouts/homepage/GioiThieu";
import DashboardPage from "./layouts/admin/Dashboard";
import {QuanLyDangNhap} from "./layouts/utils/QuanLyDangNhap";
import { QuanLyGioHang } from './layouts/utils/QuanLyGioHang';
import { ConfirmProvider } from 'material-ui-confirm';
import { Slidebar } from './layouts/admin/component/Slidebar';
import { ToastContainer } from "react-toastify";
import PageQuanLySach from "./layouts/admin/sach/PageQuanLySach";


function MyRoutes() {
    // dung useState de tao ra bien
    // bien se anh huong den Navbar, HomePage
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

    const [reloadAvatar, setReloadAvatar] = useState(0);

    // XỬ LÝ ẨN HIỆN NAV VÀ FOOTER /////////////////
    const location = useLocation();

    // Check if the current path starts with '/admin'
    const isAdminPath = location.pathname.startsWith("/admin");

    return (
    <QuanLyDangNhap>
        <QuanLyGioHang>
            <ConfirmProvider>
                {/* Customer */}
                {!isAdminPath && <Navbar key={reloadAvatar} tuKhoaTimKiem={tuKhoaTimKiem}  setTuKhoaTimKiem={setTuKhoaTimKiem}/>}
                <Routes>
                    <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />}></Route>
                    <Route path='/:maTheLoai' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                    <Route path='/about' element={<About />}></Route>


                    <Route path='/dang-ky' element={<DangKyNguoiDung />}></Route>
                    <Route path='/dang-nhap' element={<DangNhap />} />

                    <Route path='/kich-hoat/:email/:maKichHoat' element={<KichHoatTaiKhoan/>} />

                    <Route path='/bao-loi-403' element={<Error403Page />} />

                    <Route path='/chinh-sach' element={<ChinhSach />} />
                    <Route path='/gioi-thieu' element={<GioiThieu />} />
                    {!isAdminPath && (
                        <Route path='/bao-loi-404' element={<Error404Page />} />
                    )}
                </Routes>
                {!isAdminPath && <Footer />}

                {/* Admin */}
                {isAdminPath && (
                    <div className='row overflow-hidden w-100'>
                        <div className='col-2 col-md-3 col-lg-2'>
                            <Slidebar />
                        </div>
                        <div className='col-10 col-md-9 col-lg-10'>
                            <Routes>
                                <Route path='admin/dashboard' element={<DashboardPage />} />
                                <Route
                                    path='/admin/dashboard'
                                    element={<DashboardPage />}
                                />
                                <Route
                                    path='/admin/sach'
                                    element={<PageQuanLySach />}
                                />
                                <Route
                                    path='/admin/nguoi-dung'
                                    element={<UserManagementPage />}
                                />
                                <Route
                                    path='/admin/the-loai'
                                    element={<GenreManagementPage />}
                                />
                                <Route
                                    path='/admin/don-hang'
                                    element={<OrderManagementPage />}
                                />
                                {isAdminPath && (
                                    <Route path='/bao-loi-404' element={<Error404Page />} />
                                )}
                            </Routes>
                        </div>
                    </div>
                )}
                <ToastContainer
                    position='bottom-center'
                    autoClose={3000}
                    pauseOnFocusLoss={false}
                />
            </ConfirmProvider>
        </QuanLyGioHang>
    </QuanLyDangNhap>
    );
}
function App() {
    return (
        <BrowserRouter>
            <MyRoutes />
        </BrowserRouter>
    );
}

export default App;
