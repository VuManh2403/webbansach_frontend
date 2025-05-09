import React, { FormEvent, useState } from 'react';
import RequireAdmin from '../RequireAdmin';
import {Typography} from "@mui/material";
import SachModel from '../../../model/SachModel';

interface SachFormProps {
    id: number;
    option: string;
    setKeyCountReload?: any;
    handleCloseModal: any;
}

const SachForm: React.FC<SachFormProps> = (props) => {
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
        maTheLoai:[],
    })

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        fetch(  'http://localhost:8080/sach',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sach)
            }
        ).then((reponse)=>{
            if(reponse.ok){
                alert("Đã thêm sách thành công!");
                setSach({
                    maSach: 0,
                    tenSach: '',
                    giaBan: 0,
                    giaNiemYet: 0,
                    moTa: '',
                    soLuong: 0,
                    tenTacGia: '',
                    trungBinhXepHang: 0
                })
            }else{
                alert("Gặp lỗi trong quá trình thêm sách!");
            }
        })
    }

    return (
        <div>
            <Typography className='text-center' variant='h4' component='h2'>
                {props.option === "add" ? "TẠO SÁCH" : "SỬA SÁCH"}
            </Typography>
            <hr/>
            <div className='container px-5'>
                <form onSubmit={hanleSubmit} className='form'>
                    <input type='hidden' id='idBook' value={book?.idBook} hidden/>
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
                                    value={book.nameBook}
                                    onChange={(e: any) =>
                                        setBook({...book, nameBook: e.target.value})
                                    }
                                    size='small'
                                />

                                <TextField
                                    required
                                    id='filled-required'
                                    label='Tên tác giả'
                                    style={{width: "100%"}}
                                    value={book.author}
                                    onChange={(e: any) =>
                                        setBook({...book, author: e.target.value})
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
                                        Number.isNaN(book.listPrice) ? "" : book.listPrice
                                    }
                                    onChange={(e: any) =>
                                        setBook({
                                            ...book,
                                            listPrice: parseInt(e.target.value),
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
                                        Number.isNaN(book.quantity) ? "" : book.quantity
                                    }
                                    onChange={(e: any) =>
                                        setBook({
                                            ...book,
                                            quantity: parseInt(e.target.value),
                                        })
                                    }
                                    size='small'
                                />
                                <SelectMultiple
                                    selectedList={genresListSelected}
                                    setSelectedList={setGenresListSelected}
                                    selectedListName={SelectedListName}
                                    setSelectedListName={setSelectedListName}
                                    values={genresList}
                                    setValue={setBook}
                                    key={reloadCount}
                                    required={true}
                                />

                                <TextField
                                    id='filled-required'
                                    label='Giảm giá (%)'
                                    style={{width: "100%"}}
                                    type='number'
                                    value={
                                        Number.isNaN(book.discountPercent)
                                            ? ""
                                            : book.discountPercent
                                    }
                                    onChange={(e: any) => {
                                        setBook({
                                            ...book,
                                            discountPercent: parseInt(e.target.value),
                                            sellPrice:
                                                book.listPrice -
                                                Math.round(
                                                    (book.listPrice *
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
                                        value={book.sellPrice.toLocaleString("vi-vn")}
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
                                        value={book.soldQuantity}
                                        InputProps={{
                                            disabled: true,
                                        }}
                                        size='small'
                                    />

                                    <TextField
                                        id='filled-required'
                                        label='Điểm đánh giá'
                                        style={{width: "100%"}}
                                        value={book.avgRating}
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
                                    value={book.description}
                                    onChange={(e: any) =>
                                        setBook({...book, description: e.target.value})
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
                            <img src={previewThumbnail} alt='' width={100}/>
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
                            {previewRelatedImages.map((imgURL) => (
                                <img src={imgURL} alt='' width={100}/>
                            ))}
                            {previewRelatedImages.length > 0 && (
                                <Button
                                    onClick={() => {
                                        setPreviewRelatedImages([]);
                                        setBook({...book, relatedImg: []});
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
}

const SachForm_Admin = RequireAdmin(SachForm);
export default SachForm_Admin;