import React, { FormEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import {
    checkExistEmail,
    checkExistUsername,
    checkPassword,
    checkPhoneNumber,
} from "../../utils/KiemTraTonTai";

import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import NguoiDungModel from "../../../model/NguoiDungModel";
import QuyenModel from "../../../model/QuyenModel";
import {endpointBE} from "../../utils/Constant";
import {layTatCaQuyen} from "../../../api/QuyenAPI";
import {lay1NguoiDung} from "../../../api/NguoiDungAPI";
import {layTenDangNhapByToken} from "../../utils/JwtService";


interface NguoiDungFormProps {
    option: string;
    setKeyCountReload?: any;
    id: number;
    handleCloseModal: any;
}

export const NguoiDungForm: React.FC<NguoiDungFormProps> = (props) => {
    // Các biến cần thiết
    const [user, setUser] = useState<NguoiDungModel>({
        maNguoiDung: 0,
        diaChiGiaoHang: "",
        diaChiMuaHang: "",
        email: "",
        hoDem: "",
        ten: "",
        gioiTinh: "M",
        soDienThoai: "",
        tenDangNhap: "",
        matKhau: "",
        avatar: "",
        quyen: 3,
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState("");
    const [roles, setRoles] = useState<QuyenModel[]>([]);
    // Khi submit thì btn loading ...
    const [statusBtn, setStatusBtn] = useState(false);

    // Khai báo các biến lỗi
    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("");

    // Lấy ra role
    useEffect(() => {
        layTatCaQuyen().then((response) => {
            setRoles(response);
        });
    }, []);

    // Load user lên khi update
    useEffect(() => {
        if (props.option === "update") {
            lay1NguoiDung(props.id).then((response) => {
                setUser({
                    ...response,
                });
                setPreviewAvatar(response.avatar);
            });
        }
    }, [props.id, props.option]);

    function hanleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (layTenDangNhapByToken() === user.tenDangNhap) {
            toast.warning("Bạn không thể cập nhật tài khoản bạn đang sử dụng");
            return;
        }
        setStatusBtn(true);

        const endpoint =
            props.option === "add"
                ? endpointBE + "/tai-khoan/them-nguoi-dung"
                : endpointBE + "/ustai-khoaner/cap-nhap-nguoi-dung";
        const method = props.option === "add" ? "POST" : "PUT";
        toast.promise(
            fetch(endpoint, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(user),
            })
                .then((response) => {
                    if (response.ok) {
                        setUser({
                            maNguoiDung: 0,
                            diaChiGiaoHang: "",
                            diaChiMuaHang: "",
                            email: "",
                            hoDem: "",
                            ten: "",
                            gioiTinh: "M",
                            soDienThoai: "",
                            tenDangNhap: "",
                            matKhau: "",
                            avatar: "",
                            quyen: 3,
                        });
                        setAvatar(null);
                        setPreviewAvatar("");
                        setStatusBtn(false);
                        props.setKeyCountReload(Math.random());
                        props.handleCloseModal();
                        toast.success(
                            props.option === "add"
                                ? "Thêm người dùng thành công"
                                : "Cập nhật người dùng thành công"
                        );
                    } else {
                        setStatusBtn(false);
                        toast.error("Gặp lỗi trong quá trình xử lý người dùng");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setStatusBtn(false);
                    toast.error("Gặp lỗi trong quá trình xử lý người dùng");
                }),
            { pending: "Đang trong quá trình xử lý ..." }
        );
    }

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const inputElement = event.target as HTMLInputElement;

        if (inputElement.files && inputElement.files.length > 0) {
            const selectedFile = inputElement.files[0];

            const reader = new FileReader();

            reader.onload = (e: any) => {
                // e.target.result chính là chuỗi base64
                const thumnailBase64 = e.target?.result as string;
                // Tiếp tục xử lý tệp đã chọn
                setAvatar(selectedFile);
                setPreviewAvatar(URL.createObjectURL(selectedFile));
                setUser({ ...user, avatar: thumnailBase64 });
            };
            // Đọc tệp dưới dạng chuỗi base64
            reader.readAsDataURL(selectedFile);
        }
    }
    

    return (
        <div>
            <Typography className='text-center' variant='h4' component='h2'>
                {props.option === "add"
                    ? "TẠO NGƯỜI DÙNG"
                    : props.option === "update"
                        ? "SỬA NGƯỜI DÙNG"
                        : "XEM CHI TIẾT"}
            </Typography>
            <hr />
            <div className='container px-5'>
                <form onSubmit={hanleSubmit} className='form'>
                    <input type='hidden' value={user.maNguoiDung} hidden />
                    <div className='row'>
                        <div className='col-6'>
                            <Box
                                sx={{
                                    "& .MuiTextField-root": { mb: 3 },
                                }}
                            >
                                <TextField
                                    required
                                    id='filled-required'
                                    label='Tên tài khoản'
                                    style={{ width: "100%" }}
                                    error={errorUsername.length > 0 ? true : false}
                                    helperText={errorUsername}
                                    value={user.tenDangNhap}
                                    InputProps={{
                                        disabled:
                                            props.option === "update" ? true : false,
                                    }}
                                    onChange={(e: any) => {
                                        setUser({ ...user, tenDangNhap: e.target.value });
                                        setErrorUsername("");
                                    }}
                                    onBlur={(e: any) => {
                                        checkExistUsername(
                                            setErrorUsername,
                                            e.target.value
                                        );
                                    }}
                                    size='small'
                                />

                                <TextField
                                    required={props.option === "update" ? false : true}
                                    id='filled-required'
                                    type='password'
                                    label='Mật khẩu'
                                    style={{ width: "100%" }}
                                    error={errorPassword.length > 0 ? true : false}
                                    helperText={errorPassword}
                                    value={user.matKhau}
                                    onChange={(e: any) => {
                                        setUser({ ...user, matKhau: e.target.value });
                                        setErrorPassword("");
                                    }}
                                    onBlur={(e: any) => {
                                        checkPassword(setErrorPassword, e.target.value);
                                    }}
                                    size='small'
                                />

                                <TextField
                                    required
                                    id='filled-required'
                                    label='Email'
                                    type='email'
                                    style={{ width: "100%" }}
                                    error={errorEmail.length > 0 ? true : false}
                                    helperText={errorEmail}
                                    value={user.email}
                                    InputProps={{
                                        disabled:
                                            props.option === "update" ? true : false,
                                    }}
                                    onChange={(e: any) => {
                                        setUser({ ...user, email: e.target.value });
                                        setErrorEmail("");
                                    }}
                                    onBlur={(e: any) => {
                                        checkExistEmail(setErrorEmail, e.target.value);
                                    }}
                                    size='small'
                                />

                                <TextField
                                    required
                                    id='filled-required'
                                    label='Số điện thoại'
                                    style={{ width: "100%" }}
                                    error={errorPhoneNumber.length > 0 ? true : false}
                                    helperText={errorPhoneNumber}
                                    value={user.soDienThoai}
                                    onChange={(e: any) => {
                                        setUser({
                                            ...user,
                                            soDienThoai: e.target.value,
                                        });
                                        setErrorPhoneNumber("");
                                    }}
                                    onBlur={(e: any) => {
                                        checkPhoneNumber(
                                            setErrorPhoneNumber,
                                            e.target.value
                                        );
                                    }}
                                    size='small'
                                />
                                
                            </Box>
                        </div>
                        <div className='col-6'>
                            <Box
                                sx={{
                                    "& .MuiTextField-root": { mb: 3 },
                                }}
                            >
                                <TextField
                                    id='filled-required'
                                    label='Họ đệm'
                                    style={{ width: "100%" }}
                                    value={user.hoDem}
                                    onChange={(e: any) =>
                                        setUser({ ...user, hoDem: e.target.value })
                                    }
                                    size='small'
                                />

                                <TextField
                                    required
                                    id='filled-required'
                                    label='Tên'
                                    style={{ width: "100%" }}
                                    value={user.ten}
                                    onChange={(e: any) =>
                                        setUser({ ...user, ten: e.target.value })
                                    }
                                    size='small'
                                />

                                <TextField
                                    id='filled-required'
                                    label='Địa chỉ'
                                    style={{ width: "100%" }}
                                    value={user.diaChiGiaoHang}
                                    onChange={(e: any) =>
                                        setUser({
                                            ...user,
                                            diaChiGiaoHang: e.target.value,
                                        })
                                    }
                                    size='small'
                                />

                                <FormControl fullWidth size='small' sx={{ mb: 3 }}>
                                    <InputLabel id='demo-simple-select-label'>
                                        Giới tính
                                    </InputLabel>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={user.gioiTinh}
                                        label='Giới tính'
                                        onChange={(e: any) =>
                                            setUser({ ...user, gioiTinh: e.target.value })
                                        }
                                    >
                                        <MenuItem value={"M"}>Nam</MenuItem>
                                        <MenuItem value={"F"}>Nữ</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size='small'>
                                    <InputLabel id='demo-simple-select-label'>
                                        Vai trò
                                    </InputLabel>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={user.quyen}
                                        label='Vai trò'
                                        onChange={(e: any) =>
                                            setUser({
                                                ...user,
                                                quyen: e.target.value as number,
                                            })
                                        }
                                    >
                                        {roles.map((role) => (
                                            <MenuItem
                                                value={role.maQuyen}
                                                key={role.maQuyen}
                                            >
                                                {role.tenQuyen}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                            <Button
                                size='small'
                                component='label'
                                variant='outlined'
                                startIcon={<CloudUpload />}
                            >
                                Tải ảnh avatar
                                <input
                                    style={{ opacity: "0", width: "10px" }}
                                    // required
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    alt=''
                                />
                            </Button>
                            <span className='ms-3'>{avatar?.name}</span>
                            <img src={previewAvatar} alt='' width={100} />
                        </div>
                    </div>
                    <LoadingButton
                        className='w-100 my-3'
                        type='submit'
                        loading={statusBtn}
                        variant='outlined'
                        sx={{ width: "25%", padding: "10px" }}
                    >
                        {props.option === "add" ? "Tạo người dùng" : "Lưu người dùng"}
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
};
