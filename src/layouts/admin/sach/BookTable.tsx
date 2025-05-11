import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import SachModel from "../../../model/SachModel";
import { layToanBoSach } from "../../../api/SachAPI";
import {layToanBoAnhCuaMotSach} from "../../../api/HinhAnhAPI";
import {endpointBE} from "../../utils/Constant";
import {DataTable} from "../../utils/DataTable";

interface BookTableProps {
    setOption: any;
    handleOpenModal: any;
    setKeyCountReload?: any;
    keyCountReload?: any;
    setId: any;
}

export const BookTable: React.FC<BookTableProps> = (props) => {
    const [loading, setLoading] = useState(true);

    // Tạo các biến của confirm dialog
    const confirm = useConfirm();
    // Tạo biến để lấy tất cả data
    const [data, setData] = useState<SachModel[]>([]);

    // Hàm để lấy tất cả các sách render ra table
    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookResponse = await layToanBoSach(1000, 0);

                const promises = bookResponse.danhSachSach.map(async (book) => {
                    const imagesList = await layToanBoAnhCuaMotSach(book.maSach);

                    const thumbnail = imagesList.find((image) => image.thumbnail);

                    return {
                        ...book,
                        id: book.maSach,
                        thumbnail: thumbnail?.duongDan || thumbnail?.duLieuAnh,
                    };
                });
                // Promise.all(promises) nghĩa là đợi cho những Promise trên kia hoàn thành hết thì mới tới
                // câu lệnh này
                const books = await Promise.all(promises);
                setData(books);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [props.keyCountReload]);

    // Xử lý xoá sách
    const handleDeleteBook = (id: any) => {
        const token = localStorage.getItem("token");
        confirm({
            title: "Xoá sách",
            description: `Bạn chắc chắn xoá sách này chứ?`,
            confirmationText: ["Xoá"],
            cancellationText: ["Huỷ"],
        })
            .then(() => {
                fetch(endpointBE + `/sach/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            toast.success("Xoá sách thành công");
                            props.setKeyCountReload(Math.random());
                        } else {
                            toast.error("Lỗi khi xoá sách");
                        }
                    })
                    .catch((error) => {
                        toast.error("Lỗi khi xoá sách");
                        console.log(error);
                    });
            })
            .catch(() => {});
    };

    const columns: GridColDef[] = [
        { field: "maSach", headerName: "ID", width: 80 },
        {
            field: "thumbnail",
            headerName: "ẢNH",
            width: 100,
            renderCell: (params) => {
                return <img src={params.value} alt='' width={70} />;
            },
        },
        { field: "tenSach", headerName: "TÊN SÁCH", width: 350 },
        { field: "soLuongBan", headerName: "SỐ LƯỢNG", width: 100 },
        {
            field: "giaBan",
            headerName: "GIÁ BÁN",
            width: 120,
            renderCell: (params) => {
                return (
                    <span>
						{Number.parseInt(params.value).toLocaleString("vi-vn")}đ
					</span>
                );
            },
        },
        { field: "tenTacGia", headerName: "TÁC GIẢ", width: 150 },

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
                                onClick={() => handleDeleteBook(item.id)}
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
