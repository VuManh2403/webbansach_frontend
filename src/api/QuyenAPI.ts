import QuyenModel from "../model/QuyenModel";
import {endpointBE} from "../layouts/utils/Constant";
import {my_request, requestAdmin} from "./Request";

export async function layTatCaQuyen(): Promise<QuyenModel[]> {
    const endpoint = endpointBE + "/quyen";
    // Gọi phương thức request()
    const response = await requestAdmin(endpoint);

    const rolesList: QuyenModel[] = response._embedded.quyens.map((role: any) => ({
        ...role,
    }));

    return rolesList;
}

export async function layQuyenByMaNguoiDung(maNguoiDung: any): Promise<QuyenModel> {
    const endpoint = endpointBE + `/nguoi-dung/${maNguoiDung}/danhSachQuyen`;
    // Gọi phương thức request()
    const response = await my_request(endpoint);

    const rolesList: QuyenModel[] = response._embedded.quyens.map((role: any) => ({
        ...role,
    }));

    return rolesList[0];
}