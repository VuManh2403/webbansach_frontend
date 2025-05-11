import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import {useGioHang} from "../../utils/QuanLyGioHang";
import {useQuanLyDangNhap} from "../../utils/QuanLyDangNhap";
import {Link, NavLink, useNavigate } from "react-router-dom";
import {dangXuat} from "../../utils/JwtService";

interface SlidebarProps {}

export const Slidebar: React.FC<SlidebarProps> = (props) => {
	const { setDanhSachGioHang } = useGioHang();
	const { setLoggedIn } = useQuanLyDangNhap();
	const navigate = useNavigate();
	return (
		<div
			className='position-fixed bg-primary d-flex flex-column justify-content-between min-vh-100'
			style={{ zIndex: "100" }}
		>
			<div className='px-3'>
				<Link
					className='text-decoration-none d-flex align-items-center text-white d-none d-sm-flex align-items-sm-center justify-content-center'
					to='/'
				>
					<img
						src='../../../../public/images/public/BookStore.png'
						alt=''
						width={100}
					/>
				</Link>
				<hr className='text- white d-none d-sm-block d-md-block' />
				<ul className='nav nav-pills flex-column' id='parentM'>
					<li className='nav-item'>
						<NavLink
							to={"/admin/dashboard"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<DashboardIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Dashboard
							</span>
						</NavLink>
					</li>
					<li className='nav-item'>
						<NavLink
							to={"/admin/book"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<MenuBookRoundedIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý Sách
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/genre"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<CategoryRoundedIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý thể loại
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/user"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<ManageAccountsIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý tài khoản
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/order"}
							className={`nav-link d-flex align-items-center justify-content-center `}
						>
							<LocalMallRoundedIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý đơn hàng
							</span>
						</NavLink>
					</li>

				</ul>
			</div>
			<div className='dropdown open text-center'>
				<a
					className='my-3 btn border-0 dropdown-toggle text-white d-inline-flex align-items-center justify-content-center'
					type='button'
					id='triggerId'
					data-bs-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'
				>
					<PersonIcon fontSize='small' />
					<span className='ms-2'>ADMIN</span>
				</a>
				<div className='dropdown-menu' aria-labelledby='triggerId'>
					<Link
						className='dropdown-item'
						style={{ cursor: "pointer" }}
						to={"/profile"}
					>
						Thông tin cá nhân
					</Link>
					<a
						className='dropdown-item'
						style={{ cursor: "pointer" }}
						onClick={() => {
							setLoggedIn(false);
							setDanhSachGioHang([]);
							dangXuat(navigate);
						}}
					>
						Đăng xuất
					</a>
				</div>
			</div>
		</div>
	);
};
