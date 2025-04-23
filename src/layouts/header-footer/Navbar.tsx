import React, {ChangeEvent, useState} from 'react';
import {Link, NavLink} from "react-router-dom";
import {Search} from "react-bootstrap-icons";

interface NavbarProps {
    tuKhoaTimKiem: string;
    setTuKhoaTimKiem: (tuKhoa: string) => void;
}

function Navbar({ tuKhoaTimKiem, setTuKhoaTimKiem }: NavbarProps) {
    // thay vi sua luon tuKhoaTimKiem khi go vao o
    // t tao bien tuKhoaTamThoi den khi nhan nut thi ms gan tuKhoaTimKiem = tuKhoaTamThoi
    const [tuKhoaTamThoi, setTuKhoaTamThoi] = useState('');

    const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setTuKhoaTamThoi(e.target.value);
    }

    const handleSearch= ()=>{
        setTuKhoaTimKiem(tuKhoaTamThoi);
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Bookstore</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/">Trang chủ</NavLink>
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
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Quy định bán hàng
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                                <li><a className="dropdown-item" href="#">Quy định 1</a></li>
                                <li><a className="dropdown-item" href="#">Quy định 2</a></li>
                                <li><a className="dropdown-item" href="#">Quy định 3</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Liên hệ</a>
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
                <ul className="navbar-nav me-1">
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="fas fa-user"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;