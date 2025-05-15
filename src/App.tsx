import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import About from "./layouts/about/About";
import { useState } from "react";
import DashboardPage from "./admin/Dashboard";
import { ToastContainer } from "react-toastify";
import { ConfirmProvider } from "material-ui-confirm";
import BookManagementPage from "./admin/sach/BookManagement";
import OrderManagementPage from "./admin/donhang/OrderManagement";
import { Error404Page } from "./layouts/homepage/404Page";
import { Error403Page } from "./layouts/homepage/403Page";
import { AuthProvider } from "./layouts/utils/QuanLyDangNhap";
import { CartItemProvider } from "./layouts/utils/QuanLyGioHang";
import UserManagementPage from "./admin/nguoidung/UserManagement";
import GenreManagementPage from "./admin/theloai/GenreManagement";
import {Slidebar} from "./admin/component/Slidebar";
import ChinhSach from "./layouts/homepage/ChinhSach";
import HomePage from "./layouts/homepage/HomePage";


const MyRoutes = () => {
    const [reloadAvatar, setReloadAvatar] = useState(0);

    // XỬ LÝ ẨN HIỆN NAV VÀ FOOTER /////////////////
    const location = useLocation();

    // Check if the current path starts with '/admin'
    const isAdminPath = location.pathname.startsWith("/admin");
    ///////////////////////////////////////////////

    return (
        <AuthProvider>
            <CartItemProvider>
                <ConfirmProvider>
                    {/* Customer */}
                    {!isAdminPath && <Navbar key={reloadAvatar} />}
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/book/:idBook' element={<BookDetail />} />
                        <Route path='/about' element={<About />} />
                        <Route
                            path='/search/:idGenreParam'
                            element={<FilterPage />}
                        />
                        <Route path='/search' element={<FilterPage />} />
                        <Route
                            path='/my-favorite-books'
                            element={<MyFavoriteBooksPage />}
                        />
                        <Route path='/cart' element={<CartPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route
                            path='/profile'
                            element={<ProfilePage setReloadAvatar={setReloadAvatar} />}
                        />
                        <Route
                            path='/active/:email/:activationCode'
                            element={<ActiveAccount />}
                        />
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route path='/policy' element={<ChinhSach />} />
                        <Route path='/error-403' element={<Error403Page />} />
                        <Route
                            path='/check-out/status'
                            element={<CheckoutStatus />}
                        />
                        {!isAdminPath && (
                            <Route path='*' element={<Error404Page />} />
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
                                    <Route path='/admin' element={<DashboardPage />} />
                                    <Route
                                        path='/admin/dashboard'
                                        element={<DashboardPage />}
                                    />
                                    <Route
                                        path='/admin/book'
                                        element={<BookManagementPage />}
                                    />
                                    <Route
                                        path='/admin/user'
                                        element={<UserManagementPage />}
                                    />
                                    <Route
                                        path='/admin/genre'
                                        element={<GenreManagementPage />}
                                    />
                                    <Route
                                        path='/admin/order'
                                        element={<OrderManagementPage />}
                                    />

                                    {isAdminPath && (
                                        <Route path='*' element={<Error404Page />} />
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
            </CartItemProvider>
        </AuthProvider>
    );
};

function App() {
    return (
        <BrowserRouter>
            <MyRoutes />
        </BrowserRouter>
    );
}

export default App;
