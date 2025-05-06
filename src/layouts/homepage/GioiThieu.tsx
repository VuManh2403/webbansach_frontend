import React from "react";
import useScrollToTop from "../../hooks/ScrollToTop";

function GioiThieu() {
    useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
    return (
        <div className='w-100 h-100 d-flex align-items-center justify-content-center flex-column m-5'>
            <div className='w-50 h-50 p-3 rounded-5 shadow-4-strong bg-light'>
                <h3 className='text-center text-black'>Giới thiệu về BookStore</h3>
                <hr />
                <div className='row'>
                    <div className='col-lg-8'>
                        <p>
                            <strong>Tên website: </strong>BookStore
                        </p>
                        <p>
                            <strong>Địa chỉ: </strong>Thành phố Hà Nội
                        </p>
                        <p>
                            <strong>Số điện thoại: </strong>0963561525
                        </p>
                        <p>
                            <strong>Email: </strong>manh.vd203504@sis.hust.edu.vn
                        </p>
                    </div>
                    <div className='col-lg-4'>
                        <div
                            className='d-flex align-items-center justify-content-center rounded-5'
                            style={{ border: "1px solid #ccc" }}
                        >
                            <img
                                src={"./../../../images/public/logo.svg"}
                                width='150'
                                alt='MDB Logo'
                                loading='lazy'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-50 h-50 p-3 rounded-5 shadow-4-strong bg-light mt-3'>
                <h3 className='text-center text-black'>Google maps</h3>
                <hr />
                <div className='d-flex align-items-center justify-content-center'>
                    <iframe
                        title='Map'
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6619654527212!2d105.84055577503081!3d21.006183180637493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac71294bf0ab%3A0xc7e2d20e5e04a9da!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1746062304720!5m2!1svi!2s"
                        width='600'
                        height='450'
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading='lazy'
                        referrerPolicy='no-referrer-when-downgrade'
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default GioiThieu;
