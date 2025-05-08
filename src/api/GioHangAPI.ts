import GioHangModel from "../model/GioHangModel";
import {getMaNguoiDungByToken} from "../layouts/utils/JwtService";
import {endpointBE} from "../layouts/utils/Constant";
import {my_request} from "./Request";
import {laySachTheoMaGioHang} from "./SachAPI";

export async function LayTatCaGioHangByMaNguoiDung(): Promise<GioHangModel[]> {
    const idUser = getMaNguoiDungByToken();
    const endpoint = endpointBE + `/nguoi-dung/${idUser}/danhSachDonhang`;
    try {
        const cartResponse = await my_request(endpoint);

        if (cartResponse) {
            const cartsResponseList: GioHangModel[] = await Promise.all(cartResponse._embedded.donHangs.map(async (item: any) => {
                const bookResponse = await laySachTheoMaGioHang(item.idCart);
                return { ...item, book: bookResponse };
            }));
            return cartsResponseList;
        }
    } catch (error) {
        console.error('Error: ', error);
    }
    return [];
}