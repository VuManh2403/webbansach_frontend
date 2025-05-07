import React, {ChangeEvent, useState} from 'react';
import {Link, NavLink, useNavigate} from "react-router-dom";
import {Search} from "react-bootstrap-icons";
import {dangXuat, getAvatarByToken, getQuyenByToken, getTenByToken, kiemTraToken} from "../utils/JwtService";
import { Avatar } from "@mui/material";
import { Dropdown } from 'react-bootstrap';


interface NavbarProps {
    tuKhoaTimKiem: string;
    setTuKhoaTimKiem: (tuKhoa: string) => void;
}

function Navbar({ tuKhoaTimKiem, setTuKhoaTimKiem }: NavbarProps) {
    // thay vi sua luon tuKhoaTimKiem khi go vao o
    // t tao bien tuKhoaTamThoi den khi nhan nut thi ms gan tuKhoaTimKiem = tuKhoaTamThoi
    const [tuKhoaTamThoi, setTuKhoaTamThoi] = useState('');

    const navigate = useNavigate();
    const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setTuKhoaTamThoi(e.target.value);
    }

    const handleSearch= ()=>{
        setTuKhoaTimKiem(tuKhoaTamThoi);
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Bookstore</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/">Trang chủ</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/gioi-thieu">Giới thiệu</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/">Tủ sách</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Thể loại sách
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                                <li><NavLink className="dropdown-item" to="/1">Thể loại 1</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/2">Thể loại 2</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/3">Thể loại 3</NavLink></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/chinh-sach">Chính sách</NavLink>
                        </li>

                    </ul>
                </div>

                {/* Tìm kiếm */}
                <div className="d-flex" >
                    <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={onSearchInputChange} value={tuKhoaTamThoi} />
                                {/* whiteSpace: 'nowrap': Ngăn chữ xuống dòng, px-3: Tạo padding ngang hợp lý,
                                Tránh để button bị ép kích thước do container cha quá nhỏ */}
                    <button
                        className="btn btn-outline-light px-3"
                        style={{whiteSpace: 'nowrap'}}
                        type="button"
                        onClick={handleSearch}
                    >
                        <Search ></Search>
                    </button>
                </div>

                {/* Biểu tượng giỏ hàng */}
                <ul className="navbar-nav me-1">
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="fas fa-shopping-cart"></i>
                        </a>
                    </li>
                </ul>

                {/* Biểu tượng đăng nhập */}
                {!kiemTraToken() && (
                    <div>
                        <ul className="navbar-nav me-1">
                            <li className="nav-item">
                                <Link className="nav-link" to="/dang-nhap">
                                    <i className="fas fa-user"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
                {kiemTraToken() && (
                    <>
                        {/* <!-- Notifications --> */}
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                <i className="fas fa-bell"></i>
                                <span className="badge rounded-pill bg-danger text-white">1</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#">Some news</Dropdown.Item>
                                <Dropdown.Item href="#">Another news</Dropdown.Item>
                                <Dropdown.Item href="#">Something else here</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {/* <!-- Avatar --> */}
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="link"
                                id="navbarDropdownMenuAvatar"
                                className="d-flex align-items-center hidden-arrow"
                                style={{ padding: 0 }}>
                                <Avatar
                                    style={{ fontSize: "14px" }}
                                    alt={getTenByToken()?.toUpperCase()}
                                    src={getAvatarByToken()}
                                    sx={{ width: 30, height: 30 }}
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">
                                    Thông tin cá nhân
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/my-favorite-books">
                                    Sách yêu thích của tôi
                                </Dropdown.Item>
                                {getQuyenByToken() === "ADMIN" && (
                                    <Dropdown.Item as={Link} to="/admin">
                                        Quản lý
                                    </Dropdown.Item>
                                )}
                                <Dropdown.Item onClick={() => {
                                    // setTotalCart(0);
                                    dangXuat(navigate);
                                    // setLoggedIn(false);
                                    // setCartList([]);
                                }} style={{ cursor: "pointer" }}>
                                    Đăng xuất
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;