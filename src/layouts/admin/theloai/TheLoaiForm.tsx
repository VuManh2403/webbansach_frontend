/* eslint-disable no-lone-blocks */
import React, { FormEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endpointBE } from "../../utils/Constant";
import TheLoaiModel from "../../../model/TheLoaiModel";
import {lay1TheLoai} from "../../../api/TheLoaiAPI";
import {kiemTraTokenHetHan} from "../../utils/JwtService";

interface TheLoaiFormProps {
    option: string;
    id: number;
    handleCloseModal: any;
    setKeyCountReload?: any;
}

export const TheLoaiForm: React.FC<TheLoaiFormProps> = (props) => {
    const [genre, setGenre] = useState<TheLoaiModel>({
        maTheLoai: 0,
        tenTheLoai: "",
    });

    // Lấy dữ liệu khi mà update
    useEffect(() => {
        if (props.option === "update") {
            lay1TheLoai(props.id).then((response) =>
                setGenre({
                    maTheLoai: response.theLoai.maTheLoai,
                    tenTheLoai: response.theLoai.tenTheLoai,
                })
            );
        }
    }, [props.id, props.option]);

    function hanleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }
        if (!kiemTraTokenHetHan(token)) {
            alert("Token đã hết hạn. Vui lòng đăng nhập lại!");
            return;
        }

        const method = props.option === "add" ? "POST" : "PUT";
        const endpoint =
            props.option === "add"
                ? endpointBE + "/the-loai"
                : endpointBE + `/the-loai/${props.id}`;

        fetch(endpoint, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(genre),
        })
            .then((response) => {
                if (response.ok) {
                    setGenre({
                        maTheLoai: 0,
                        tenTheLoai: "",
                    });

                    props.option === "add"
                        ? toast.success("Thêm thể loại thành công")
                        : toast.success("Cập nhật thể loại thành công");

                    props.setKeyCountReload(Math.random());
                    props.handleCloseModal();
                } else {
                    toast.error("Lỗi khi thưc hiện hành động");
                    props.handleCloseModal();
                }
            })
            .catch((e) => {
                toast.error("Lỗi khi thưc hiện hành động");
                props.handleCloseModal();
                console.log(e);
            });
    }
    return (
        <div>
            <Typography className='text-center' variant='h4' component='h2'>
                {props.option === "add"
                    ? "TẠO THỂ LOẠI"
                    : props.option === "update"
                        ? "SỬA THỂ LOẠI"
                        : "XEM CHI TIẾT"}
            </Typography>
            <hr />
            <div className='container px-5'>
                <form onSubmit={hanleSubmit} className='form'>
                    <input type='hidden' id='idGenre' value={genre.maTheLoai} hidden />
                    <Box
                        sx={{
                            "& .MuiTextField-root": { mb: 3 },
                        }}
                    >
                        <TextField
                            required
                            id='filled-required'
                            label='Tên thể loại'
                            style={{ width: "100%" }}
                            value={genre.tenTheLoai}
                            onChange={(e) =>
                                setGenre({ ...genre, tenTheLoai: e.target.value })
                            }
                            size='small'
                        />
                    </Box>
                    {props.option !== "view" && (
                        <button className='btn btn-primary w-100 my-3' type='submit'>
                            {props.option === "add" ? "Tạo thể loại" : "Lưu thể loại"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
