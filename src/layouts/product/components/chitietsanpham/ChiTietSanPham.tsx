import React from "react";
import { Chip } from "@mui/material";
import DonHangModel from "../../../../model/DonHangModel";
import { format } from "date-fns/format";
import { StepperComponent } from "../../../utils/StepperComponent";
import { BookHorizontal } from "../BookHorizontalProps";

interface ChiTietSanPhamProps {
    order: DonHangModel;
    activeStep: number;
    steps: String[];
    handleCloseModal: any;
    type?: string;
}

export const ChiTietSanPham: React.FC<ChiTietSanPhamProps> = (props) => {
    return (
        <>
            <Chip
                label={props.order.trangThai}
                sx={{ width: "auto-fit" }}
                color={
                    props.order.trangThai === "Thành công"
                        ? "success"
                        : props.order.trangThai === "Đang xử lý"
                            ? "info"
                            : props.order.trangThai === "Đang giao hàng"
                                ? "warning"
                                : "error"
                }
                variant='outlined'
            />
            <div className='row'>
                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <p className='mt-2'>
                        Mã đơn hàng:{" "}
                        <strong className='ms-2'>{props.order.maDonHang}</strong>
                    </p>
                    <p>
                        Ngày mua:
                        <strong className='ms-2'>
                            {format(new Date(props.order.ngayTao), "dd/MM/yyyy")}
                        </strong>
                    </p>
                    <p>
                        Tổng tiền:
                        <strong className='ms-2'>
                            {props.order.tongTien.toLocaleString("vi-vn")} đ
                        </strong>
                    </p>
                    <p>
                        Phương thức thanh toán:
                        <strong className='ms-2'>{props.order.thanhToan}</strong>
                    </p>
                </div>
                <div className='col-lg-4 col-md-6 col-sm-12'>
                    <p>
                        Họ và tên:
                        <strong className='ms-2'>{props.order.hoVaTen}</strong>
                    </p>
                    <p>
                        Địa chỉ giao hàng:
                        <strong className='ms-2'>
                            {props.order.diaChiGiaoHang}
                        </strong>
                    </p>
                    <p>
                        Số điện thoại:
                        <strong className='ms-2'>{props.order.soDienThoai}</strong>
                    </p>
                </div>
                <div className='col'>
                    <StepperComponent
                        steps={props.steps}
                        activeStep={props.activeStep}
                    />
                </div>
            </div>
            <hr className='mt-3' />
            <p>
                <strong className='text-warning'>Ghi chú:</strong>
                <span className='ms-2'>{props.order.ghiChu}</span>
            </p>
            <hr className='mt-3' />
            {props.order.gioHang?.map((cartItem, index) => (
                <BookHorizontal
                    cartItem={cartItem}
                    key={index}
                    type={props.type}
                    idOrder={props.order.maDonHang}
                    handleCloseModalOrderDetail={props.handleCloseModal}
                    statusOrder={props.order.trangThai}
                />
            ))}
        </>
    );
};
