import React, { FormEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { toast } from "react-toastify";
import DonHangModel from "../../../model/DonHangModel";
import { lay1DonHang} from "../../../api/DonHangAPI";
import {endpointBE} from "../../utils/Constant";
import { ChiTietSanPham } from "../../product/components/chitietsanpham/ChiTietSanPham";

interface DonHangFormProps {
    id: any;
    option?: string;
    setKeyCountReload?: any;
    handleCloseModal?: any;
}

export const DonHangForm: React.FC<DonHangFormProps> = (props) => {
    const [order, setOrder] = useState<DonHangModel>({
        maDonHang: 0,
        diaChiGiaoHang: "",
        tongTien: 0,
        tongTienSanPham: 0,
        chiPhiGiaoHang: 0,
        chiPhiThanhToan: 0,
        ngayTao: new Date(),
        trangThai: "",
        ghiChu: "",
        thanhToan: "",
    });

    // Step
    const [steps, setSteps] = useState<String[]>([]);
    const [activeStep, setActiveStep] = useState(0);

    // Lấy 1 đơn hàng khi cập nhật
    useEffect(() => {
        lay1DonHang(props.id)
            .then((response) => {
                setOrder(response);
                if (response.trangThai === "Bị huỷ") {
                    setSteps(["Đang xử lý", "Bị huỷ"]);
                    setActiveStep(["Đang xử lý", "Bị huỷ"].indexOf(response.trangThai));
                } else {
                    setSteps(["Đang xử lý", "Đang giao hàng", "Thành công"]);
                    setActiveStep(
                        ["Đang xử lý", "Đang giao hàng", "Thành công"].indexOf(
                            response.trangThai
                        )
                    );
                }
            })
            .catch((error) => console.log(error));
    }, [props.option, props.id]);

    function hanleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        fetch(endpointBE + "/danh-sach-don-hang/cap-nhap-don-hang", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        })
            .then((response) => {
                if (response.ok) {
                    props.setKeyCountReload(Math.random());
                    toast.success("Cập nhật đơn hàng thành công");
                    props.handleCloseModal();
                } else {
                    toast.error("Gặp lỗi trong quá trình cập nhật đơn hàng");
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Gặp lỗi trong quá trình cập nhật đơn hàng");
            });
    }

    const handleCancleOrder = () => {
        const token = localStorage.getItem("token");

        fetch(endpointBE + "/danh-sach-don-hang/cap-nhap-don-hang", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...order, status: "Bị huỷ" }),
        })
            .then((response) => {
                if (response.ok) {
                    props.setKeyCountReload(Math.random());
                    toast.success("Huỷ đơn hàng thành công");
                    props.handleCloseModal();
                } else {
                    toast.error("Gặp lỗi trong quá trình huỷ đơn hàng");
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Gặp lỗi trong quá trình huỷ đơn hàng");
            });
    };

    return (
        <div>
            <Typography className='text-center' variant='h4' component='h2'>
                {props.option === "update"
                    ? "CẬP NHẬT ĐƠN HÀNG"
                    : "CHI TIẾT ĐƠN HÀNG"}
            </Typography>
            <hr />
            <div className='container px-5'>
                <form onSubmit={hanleSubmit} className='form'>
                    <input type='hidden' value={order.maDonHang} hidden />
                    {props.option === "update" ? (
                        <FormControl sx={{ m: 1 }} size='small' fullWidth>
                            <InputLabel id='demo-simple-select-helper-label'>
                                Trạng thái đơn hàng
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-helper-label'
                                id='demo-simple-select-helper'
                                value={order.trangThai}
                                label='Trạng thái đơn hàng'
                                autoWidth
                                onChange={(e) =>
                                    setOrder({ ...order, trangThai: e.target.value })
                                }
                            >
                                <MenuItem value='Đang xử lý'>Đang xử lý</MenuItem>
                                <MenuItem value='Đang giao hàng'>
                                    Đang giao hàng
                                </MenuItem>
                                <MenuItem value='Thành công'>Thành công</MenuItem>
                                <MenuItem value='Bị huỷ'>Huỷ</MenuItem>
                            </Select>
                        </FormControl>
                    ) : (
                        <>
                            {props.option === "view-customer" &&
                                order.trangThai === "Đang xử lý" && (
                                    <>
                                        <Button
                                            className='me-3'
                                            variant='contained'
                                            color='error'
                                            onClick={() => handleCancleOrder()}
                                        >
                                            huỷ đơn hàng
                                        </Button>
                                    </>
                                )}
                            <ChiTietSanPham
                                order={order}
                                steps={steps}
                                activeStep={activeStep}
                                handleCloseModal={props.handleCloseModal}
                                type={props.option}
                            />
                        </>
                    )}
                    {props.option !== "view-customer" && props.option !== "view" && (
                        <button className='btn btn-primary w-100 my-3' type='submit'>
                            Cập nhật đơn hàng
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
