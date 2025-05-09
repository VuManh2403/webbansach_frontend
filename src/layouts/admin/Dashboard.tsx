import RequireAdmin from "./RequireAdmin";
import {useEffect, useState} from "react";
import DonHangModel from "../../model/DonHangModel";
import {layToanBoQuyenNguoiDung} from "../../api/NguoiDungAPI";
import {layTatCaDonHang} from "../../api/DonHangAPI";
import {layTongSoSach} from "../../api/SachAPI";
import {layTongSoDanhGia} from "../../api/DanhGiaAPI";
import {ThongSoKyThuat} from "./ThongSoKyThuat";
import {BieuDo} from "./bieudo/BieuDo";

const Dashboard = () => {
    const [tongTien, setTongTien] = useState(0);
    const [soLuongTaiKhoan, setSoLuongTaiKhoan] = useState(0);
    const [soLuongDonHang, setSoLuongDonHang] = useState(0);
    const [tongSoSach, setTongSoSach] = useState(0);
    const [tongSoDanhGia, setTongSoDanhGia] = useState(0);
    const [danhSachDonHang, setDanhSachDonHang] = useState<DonHangModel[]>([]);

    // Lấy tổng số account
    useEffect(() => {
        layToanBoQuyenNguoiDung()
            .then((response) => {
                setSoLuongTaiKhoan(response.flat().length);
            })
            .catch((error) => console.log(error));
    }, []);

    // Lấy tổng số hoá đơn và tổng tiền kiếm được
    useEffect(() => {
        layTatCaDonHang()
            .then((response) => {
                setDanhSachDonHang(response);
                const soLuongDonHangs = response.length;
                setSoLuongDonHang(soLuongDonHangs);
                const tongTienResponse = response.reduce((prevValue, order) => {
                    if (order.trangThai === "Thành công") {
                        return prevValue + order.tongTien;
                    }
                    return prevValue;
                }, 0);
                setTongTien(tongTienResponse);
            })
            .catch((error) => console.log(error));
    }, []);

    // Lấy tổng số sách
    useEffect(() => {
        layTongSoSach()
            .then((response) => {
                setTongSoSach(response);
            })
            .catch((error) => console.log(error));
    }, []);



    // Lấy tổng số review
    useEffect(() => {
        layTongSoDanhGia()
            .then((response) => {
                setTongSoDanhGia(response);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div>
            <ThongSoKyThuat
                tongTien={tongTien}
                soLuongTaiKhoan={soLuongTaiKhoan}
                soLuongDonHang={soLuongDonHang}
                tongSoSach={tongSoSach}
                tongSoDanhGia={tongSoDanhGia}
            />
            <BieuDo danhSachDonHang={danhSachDonHang} />
        </div>
    );
};

const DashboardPage = RequireAdmin(Dashboard);
export default DashboardPage;