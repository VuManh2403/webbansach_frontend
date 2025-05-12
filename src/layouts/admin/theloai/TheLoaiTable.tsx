import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../utils/DataTable";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { endpointBE } from "../../utils/Constant";
import TheLoaiModel from "../../../model/TheLoaiModel";
import {layTatCaTheLoai} from "../../../api/TheLoaiAPI";

interface TheLoaiTableProps {
    setOption: any;
    handleOpenModal: any;
    setId: any;
    setKeyCountReload?: any;
    keyCountReload?: any;
}

export const TheLoaiTable: React.FC<TheLoaiTableProps> = (props) => {
    const [loading, setLoading] = useState(true);
    // Tạo các biến của confirm dialog
    const confirm = useConfirm();

    // Tạo biến để lấy tất cả data
    const [data, setData] = useState<TheLoaiModel[]>([]);
    useEffect(() => {
        layTatCaTheLoai().then((response) => {
            const genres = response.danhSachTheLoai.map((genre) => ({
                ...genre,
                id: genre.maTheLoai,
            }));
            setData(genres);
            setLoading(false);
        });
    }, [props.keyCountReload]);

    const handleDeleteGenre = (id: any) => {
        const token = localStorage.getItem("token");

        confirm({
            title: "Xoá thể loại",
            description: `Bạn chắc chắn xoá thể loại này chứ?`,
            confirmationText: ["Xoá"],
            cancellationText: ["Huỷ"],
        })
            .then(() => {
                fetch(endpointBE + `/the-loai/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            toast.success("Xoá thể loại thành công");
                            props.setKeyCountReload(Math.random());
                        } else {
                            toast.error("Lỗi khi xoá thể loại");
                        }
                    })
                    .catch((error) => {
                        toast.error("Lỗi khi xoá thể loại");
                        console.log(error);
                    });
            })
            .catch(() => {});
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "nameGenre", headerName: "TÊN THỂ LOẠI", width: 300 },
        {
            field: "action",
            headerName: "HÀNH ĐỘNG",
            width: 300,
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
                                onClick={() => handleDeleteGenre(item.id)}
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
