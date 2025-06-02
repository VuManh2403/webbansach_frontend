/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import { logout } from "../../utils/JwtService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {useCartItem} from "../../utils/QuanLyGioHang";
import {useAuth} from "../../utils/QuanLyDangNhap";


interface SlidebarProps {}

export const Slidebar: React.FC<SlidebarProps> = (props) => {
	const { setCartList } = useCartItem();
	const { setLoggedIn } = useAuth();
	const navigate = useNavigate();
	return (
		<div
			className="position-fixed bg-primary d-flex flex-column justify-content-between min-vh-100"
			style={{ width: "240px", zIndex: "100" }}
		>
			{/* Logo */}
			<div className="px-3 pt-3">
				<a
					className="text-decoration-none d-flex justify-content-center align-items-center text-white mb-3"
					href="#"
				>
					<img src="/images/public/BookStore.png" alt="Logo" width={100} />
				</a>
				<hr className="text-white" />

				{/* Sidebar Nav */}
				<ul className="nav flex-column">
					<li className="nav-item mb-3">
						<NavLink
							to="/admin/dashboard"
							className="nav-link bg-white text-primary fw-bold d-flex align-items-center rounded px-3 py-2"

						>
							<DashboardIcon fontSize="small" />
							<span className="ms-2">DASHBOARD</span>
						</NavLink>
					</li>
					<li className="nav-item mb-3">
						<NavLink
							to="/admin/book"
							className="nav-link bg-white text-dark d-flex align-items-center rounded px-3 py-2"

						>
							<MenuBookRoundedIcon fontSize="small" />
							<span className="ms-2">QUẢN LÝ SÁCH</span>
						</NavLink>
					</li>
					<li className="nav-item mb-3">
						<NavLink
							to="/admin/genre"
							className="nav-link bg-white text-dark d-flex align-items-center rounded px-3 py-2"

						>
							<CategoryRoundedIcon fontSize="small" />
							<span className="ms-2">QUẢN LÝ THỂ LOẠI</span>
						</NavLink>
					</li>
					<li className="nav-item mb-3">
						<NavLink
							to="/admin/user"
							className="nav-link bg-white text-dark d-flex align-items-center rounded px-3 py-2"

						>
							<ManageAccountsIcon fontSize="small" />
							<span className="ms-2">QUẢN LÝ TÀI KHOẢN</span>
						</NavLink>
					</li>
					<li className="nav-item mb-3">
						<NavLink
							to="/admin/order"
							className="nav-link bg-white text-dark d-flex align-items-center rounded px-3 py-2"
							
						>
							<LocalMallRoundedIcon fontSize="small" />
							<span className="ms-2">QUẢN LÝ ĐƠN HÀNG</span>
						</NavLink>
					</li>
				</ul>
			</div>

			{/* Dropdown Bottom Admin */}
			<div className="dropdown text-center mb-4">
				<a
					className="btn btn-outline-light dropdown-toggle d-inline-flex align-items-center px-3 py-2"
					type="button"
					id="triggerId"
					data-bs-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
				>
					<PersonIcon fontSize="small" />
					<span className="ms-2">ADMIN</span>
				</a>
				<div className="dropdown-menu" aria-labelledby="triggerId">
					<Link className="dropdown-item" to="/profile">
						Thông tin cá nhân
					</Link>
					<a
						className="dropdown-item"
						style={{ cursor: "pointer" }}
						onClick={() => {
							setLoggedIn(false);
							setCartList([]);
							logout(navigate);
						}}
					>
						Đăng xuất
					</a>
				</div>
			</div>
		</div>

	);
};
