import React, { FormEvent, useEffect, useState } from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import SachModel from '../../../model/SachModel';
import TheLoaiModel from "../../../model/TheLoaiModel";
import {laySachTheoMaLienQuan} from "../../../api/SachAPI";
import {layTatCaTheLoai} from "../../../api/TheLoaiAPI";
import { endpointBE } from '../../utils/Constant';
import { toast } from 'react-toastify';
import { SelectMultiple } from '../../utils/SelectMultiple';
import { CloudUpload } from '@mui/icons-material';
import { LoadingButton } from "@mui/lab";

interface SachFormProps {
    id: number;
    option: string;
    setKeyCountReload?: any;
    handleCloseModal: any;
}

export const SachForm: React.FC<SachFormProps> = (props) => {
    const [sach, setSach] = useState<SachModel>({
        maSach: 0,
        tenSach: '',
        giaBan: NaN,
        giaNiemYet: NaN,
        moTa: '',
        soLuong: NaN,
        tenTacGia: '',
        trungBinhXepHang: NaN,
        soLuongBan:NaN,
        giamGia:0,
        thumbnail:"",
        danhSachAnh:[],
        danhSachTheLoai:[],
    })

    const [danhSachTheLoai, setDanhSachTheLoai] = useState<TheLoaiModel[]>([]);
    const [danhSachTheLoaiDaChon, setDanhSachTheLoaiDaChon] = useState<number[]>([]);
    const [danhGiaThumbnail, setDanhGiaThumbnail] = useState("");
    const [danhSachHinhAnhDanhGia, setDanhSachHinhAnhDanhGia] = useState<string[]>(
        []
    );
    // Giá trị khi đã chọn ở trong select multiple
    const [SelectedListName, setSelectedListName] = useState<any[]>([]);
    // Khi submit thì btn loading ...
    const [statusBtn, setStatusBtn] = useState(false);
    // Biến reload (cho selectMultiple)
    const [reloadCount, setReloadCount] = useState(0);

    // Lấy dữ liệu khi update
    useEffect(() => {
        if (props.option === "update") {
            laySachTheoMaLienQuan(props.id).then((response) => {
                setSach(response as SachModel);
                setDanhGiaThumbnail(response?.thumbnail as string);
                setDanhSachHinhAnhDanhGia(response?.danhSachAnh as string[]);
                response?.danhSachTheLoai?.forEach((data) => {
                    setSelectedListName((prev) => [...prev, data.tenTheLoai]);
                    setSach((prevBook) => {
                        return {
                            ...prevBook,
                            maTheLoai: [...(prevBook.maTheLoai || []), data.maTheLoai],
                        };
                    });
                });
            });
        }
    }, [props.option, props.id]);

    // Khúc này lấy ra tất cả thể loại để cho vào select
    useEffect(() => {
        layTatCaTheLoai().then((response) => {
            setDanhSachTheLoai(response.danhSachTheLoai);
        });
    }, [props.option]);

    // Khúc này để lưu danh sách thể loại của sách
    useEffect(() => {
        setSach({ ...sach, maTheLoai: danhSachTheLoaiDaChon });
    }, [danhSachTheLoaiDaChon]);

    async function hanleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        let bookRequest: SachModel = sach;
        if (bookRequest.giamGia === 0) {
            bookRequest = { ...sach, giaBan: sach.giaNiemYet };
        }

        // console.log(book);

        setStatusBtn(true);

        const endpoint =
            props.option === "add"
                ? endpointBE + "/chinh-sua-sach/them-sach"
                : endpointBE + "/chinh-sua-sach/cap-nhap-sach";
        const method = props.option === "add" ? "POST" : "PUT";
        toast.promise(
            fetch(endpoint, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(bookRequest),
            })
                .then((response) => {
                    if (response.ok) {
                        setSach({
                            maSach: 0,
                            tenSach: '',
                            giaBan: NaN,
                            giaNiemYet: NaN,
                            moTa: '',
                            soLuong: NaN,
                            tenTacGia: '',
                            trungBinhXepHang: NaN,
                            soLuongBan:NaN,
                            giamGia:0,
                            thumbnail:"",
                            danhSachAnh:[],
                            danhSachTheLoai:[],
                        });
                        setDanhGiaThumbnail("");
                        setDanhSachHinhAnhDanhGia([]);
                        setReloadCount(Math.random());
                        setStatusBtn(false);
                        props.setKeyCountReload(Math.random());
                        props.handleCloseModal();
                        props.option === "add"
                            ? toast.success("Thêm sách thành công")
                            : toast.success("Cập nhật sách thành công");
                    } else {
                        toast.error("Gặp lỗi trong quá trình xử lý sách");
                        setStatusBtn(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setStatusBtn(false);
                    toast.error("Gặp lỗi trong quá trình xử lý sách");
                }),
            {
                pending: "Đang trong quá trình xử lý ...",
            }
        );
    }

    function handleThumnailImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const inputElement = event.target as HTMLInputElement;

        if (inputElement.files && inputElement.files.length > 0) {
            const selectedFile = inputElement.files[0];

            const reader = new FileReader();

            // Xử lý sự kiện khi tệp đã được đọc thành công
            reader.onload = (e: any) => {
                // e.target.result chính là chuỗi base64
                const thumnailBase64 = e.target?.result as string;

                setSach({ ...sach, thumbnail: thumnailBase64 });

                setDanhGiaThumbnail(URL.createObjectURL(selectedFile));
            };

            // Đọc tệp dưới dạng chuỗi base64
            reader.readAsDataURL(selectedFile);
        }
    }

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const inputElement = event.target as HTMLInputElement;

        if (inputElement.files && inputElement.files.length > 0) {
            const newPreviewImages = [...danhSachHinhAnhDanhGia];

            if (newPreviewImages.length + inputElement.files.length > 5) {
                toast.warning("Chỉ được tải lên tối đa 5 ảnh");
                return;
            }

            // Duyệt qua từng file đã chọn
            for (let i = 0; i < inputElement.files.length; i++) {
                const selectedFile = inputElement.files[i];

                const reader = new FileReader();

                // Xử lý sự kiện khi tệp đã được đọc thành công
                reader.onload = (e: any) => {
                    // e.target.result chính là chuỗi base64
                    const thumbnailBase64 = e.target?.result as string;

                    setSach((prevBook) => ({
                        ...prevBook,
                        relatedImg: [...(prevBook.danhSachAnh || []), thumbnailBase64],
                    }));

                    newPreviewImages.push(URL.createObjectURL(selectedFile));

                    // Cập nhật trạng thái với mảng mới
                    setDanhSachHinhAnhDanhGia(newPreviewImages);
                };

                // Đọc tệp dưới dạng chuỗi base64
                reader.readAsDataURL(selectedFile);
            }
        }
    }

    return (
        <div>
            <Typography className='text-center' variant='h4' component='h2'>
                {props.option === "add" ? "TẠO SÁCH" : "SỬA SÁCH"}
            </Typography>
            <hr/>
            <div className='container px-5'>
                <form onSubmit={hanleSubmit} className='form'>
                    <input type='hidden' id='maSach' value={sach?.maSach} hidden/>
                    <div className='row'>
                        <div
                            className={props.option === "update" ? "col-4" : "col-6"}
                        >
                            <Box
                                sx={{
                                    "& .MuiTextField-root": {mb: 3},
                                }}
                            >
                                <TextField
                                    required
                                    id='filled-required'
                                    label='Tên sách'
                                    style={{width: "100%"}}
                                    value={sach.tenSach}
                                    onChange={(e: any) =>
                                        setSach({...sach, tenSach: e.target.value})
                                    }
                                    size='small'
                                />

                                <TextField
                                    required
                                    id='filled-required'
                                    label='Tên tác giả'
                                    style={{width: "100%"}}
                                    value={sach.tenTacGia}
                                    onChange={(e: any) =>
                                        setSach({...sach, tenTacGia: e.target.value})
                                    }
                                    size='small'
                                />

                                <TextField
                                    required
                                    id='filled-required'
                                    label='Giá niêm yết'
                                    style={{width: "100%"}}
                                    type='number'
                                    value={
                                        Number.isNaN(sach.giaNiemYet) ? "" : sach.giaNiemYet
                                    }
                                    onChange={(e: any) =>
                                        setSach({
                                            ...sach,
                                            giaNiemYet: parseInt(e.target.value),
                                        })
                                    }
                                    size='small'
                                />
                            </Box>
                        </div>
                        <div
                            className={props.option === "update" ? "col-4" : "col-6"}
                        >
                            <Box
                                sx={{
                                    "& .MuiTextField-root": {mb: 3},
                                }}
                            >
                                <TextField
                                    required
                                    id='filled-required'
                                    label='Số lượng'
                                    style={{width: "100%"}}
                                    type='number'
                                    value={
                                        Number.isNaN(sach.soLuong) ? "" : sach.soLuong
                                    }
                                    onChange={(e: any) =>
                                        setSach({
                                            ...sach,
                                            soLuong: parseInt(e.target.value),
                                        })
                                    }
                                    size='small'
                                />
                                <SelectMultiple
                                    selectedList={danhSachTheLoaiDaChon}
                                    setSelectedList={setDanhSachTheLoaiDaChon}
                                    selectedListName={SelectedListName}
                                    setSelectedListName={setSelectedListName}
                                    values={danhSachTheLoai}
                                    setValue={setSach}
                                    key={reloadCount}
                                    required={true}
                                />

                                <TextField
                                    id='filled-required'
                                    label='Giảm giá (%)'
                                    style={{width: "100%"}}
                                    type='number'
                                    value={
                                        Number.isNaN(sach.giamGia)
                                            ? ""
                                            : sach.giamGia
                                    }
                                    onChange={(e: any) => {
                                        setSach({
                                            ...sach,
                                            giamGia: parseInt(e.target.value),
                                            giaBan:
                                                sach.giaNiemYet -
                                                Math.round(
                                                    (sach.giaNiemYet *
                                                        Number.parseInt(e.target.value)) /
                                                    100
                                                ),
                                        });
                                    }}
                                    size='small'
                                />
                            </Box>
                        </div>
                        {props.option === "update" && (
                            <div className='col-4'>
                                <Box
                                    sx={{
                                        "& .MuiTextField-root": {mb: 3},
                                    }}
                                >
                                    <TextField
                                        id='filled-required'
                                        label='Giá bán'
                                        style={{width: "100%"}}
                                        value={sach.giaBan.toLocaleString("vi-vn")}
                                        type='number'
                                        InputProps={{
                                            disabled: true,
                                        }}
                                        size='small'
                                    />

                                    <TextField
                                        id='filled-required'
                                        label='Đã bán'
                                        style={{width: "100%"}}
                                        value={sach.soLuongBan}
                                        InputProps={{
                                            disabled: true,
                                        }}
                                        size='small'
                                    />

                                    <TextField
                                        id='filled-required'
                                        label='Điểm đánh giá'
                                        style={{width: "100%"}}
                                        value={sach.trungBinhXepHang}
                                        InputProps={{
                                            disabled: true,
                                        }}
                                        size='small'
                                    />
                                </Box>
                            </div>
                        )}
                        <div className='col-12'>
                            <Box>
                                <TextField
                                    id='outlined-multiline-flexible'
                                    label='Mô tả sách'
                                    style={{width: "100%"}}
                                    multiline
                                    maxRows={5}
                                    value={sach.moTa}
                                    onChange={(e: any) =>
                                        setSach({...sach, moTa: e.target.value})
                                    }
                                    required
                                />
                            </Box>
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                            <Button
                                size='small'
                                component='label'
                                variant='outlined'
                                startIcon={<CloudUpload/>}
                            >
                                Tải ảnh thumbnail
                                <input
                                    style={{opacity: "0", width: "10px"}}
                                    required={props.option === "update" ? false : true}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleThumnailImageUpload}
                                    alt=''
                                />
                            </Button>
                            <img src={danhGiaThumbnail} alt='' width={100}/>
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                            <Button
                                size='small'
                                component='label'
                                variant='outlined'
                                startIcon={<CloudUpload/>}
                            >
                                Tải ảnh liên quan
                                <input
                                    style={{opacity: "0", width: "10px"}}
                                    // required
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    multiple
                                    alt=''
                                />
                            </Button>
                            {danhSachHinhAnhDanhGia.map((imgURL) => (
                                <img src={imgURL} alt='' width={100}/>
                            ))}
                            {danhSachHinhAnhDanhGia.length > 0 && (
                                <Button
                                    onClick={() => {
                                        setDanhSachHinhAnhDanhGia([]);
                                        setSach({...sach, danhSachAnh: []});
                                    }}
                                >
                                    Xoá tất cả
                                </Button>
                            )}
                        </div>
                    </div>
                    {props.option !== "view" && (
                        <LoadingButton
                            className='w-100 my-3'
                            type='submit'
                            loading={statusBtn}
                            variant='outlined'
                            sx={{width: "25%", padding: "10px"}}
                        >
                            {props.option === "add" ? "Tạo sách" : "Lưu sách"}
                        </LoadingButton>
                    )}
                </form>
            </div>
        </div>
    );
};

