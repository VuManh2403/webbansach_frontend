import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../utils/DataTable";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import { endpointBE } from "../../utils/Constant";
import NguoiDungModel from "../../../model/NguoiDungModel";
import {layToanBoQuyenNguoiDung} from "../../../api/NguoiDungAPI";

interface NguoiDungTableProps {
    setOption: any;
    handleOpenModal: any;
    setKeyCountReload?: any;
    keyCountReload?: any;
    setId: any;
}

export const NguoiDungTable: React.FC<NguoiDungTableProps> = (props) => {
    const [loading, setLoading] = useState(true);
    // Tạo biến để lấy tất cả data
    const [data, setData] = useState<NguoiDungModel[]>([]);

    const confirm = useConfirm();

    // Xử lý xoá user
    function handleDeleteUser(maNguoiDung: any) {
        const token = localStorage.getItem("token");
        confirm({
            title: "Xoá sách",
            description: `Bạn chắc chắn xoá người dùng này chứ?`,
            confirmationText: ["Xoá"],
            cancellationText: ["Huỷ"],
        })
            .then(() => {
                toast.promise(
                    fetch(endpointBE + `/tai-Khoan/xoa-nguoi-dung/${maNguoiDung}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (response.ok) {
                                toast.success("Xoá người dùng thành công");
                                props.setKeyCountReload(Math.random());
                            } else {
                                toast.error("Lỗi khi xoá người dùng");
                            }
                        })
                        .catch((error) => {
                            toast.error("Lỗi khi xoá người dùng");
                            console.log(error);
                        }),
                    { pending: "Đang trong quá trình xử lý ..." }
                );
            })
            .catch(() => {});
    }

    useEffect(() => {
        layToanBoQuyenNguoiDung()
            .then((response) => {
                let users = response
                    .flat()
                    .map((user) => ({ ...user, maNguoiDung: user.maNguoiDung }));
                users = users.sort((u1, u2) => u1.maNguoiDung - u2.maNguoiDung);
                setData(users);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, [props.keyCountReload]);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "username", headerName: "TÊN TÀI KHOẢN", width: 120 },
        {
            field: "role",
            headerName: "VAI TRÒ",
            width: 150,
            renderCell: (params) => {
                return (
                    <Chip
                        label={params.value}
                        color={params.value === "CUSTOMER" ? "success" : "error"}
                        variant='outlined'
                    />
                );
            },
        },
        { field: "lastName", headerName: "TÊN", width: 100 },
        {
            field: "dateOfBirth",
            headerName: "NGÀY SINH",
            width: 100,
        },
        { field: "email", headerName: "EMAIL", width: 200 },
        { field: "phoneNumber", headerName: "SỐ ĐIỆN THOẠI", width: 120 },

        {
            field: "action",
            headerName: "HÀNH ĐỘNG",
            width: 200,
            type: "actions",
            renderCell: (item) => {
                return (
                    <div>
                        <Tooltip title={"Chỉnh sửa"}>
                            <IconButton
                                color='primary'
                                onClick={() => {
                                    props.setOption("update");
                                    props.setId(item.id);
                                    props.handleOpenModal();
                                }}
                            >
                                <EditOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Xoá"}>
                            <IconButton
                                color='error'
                                onClick={() => handleDeleteUser(item.id)}
                            >
                                <DeleteOutlineOutlined />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <DataTable columns={columns} rows={data} />;
};
