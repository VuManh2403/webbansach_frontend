import {useEffect, useState } from "react";
import SachModel from "../../../model/SachModel";
import {lay3SachBanChay} from "../../../api/SachAPI";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import TextEllipsis from "../../product/components/ngatvanbanbangdau3cham/TextEllipsis";


const Top3BestSeller = () => {
	// Lấy dữ liệu top 4 sách được mua nhiều nhất
	const [top3BestSeller, setTop3BestSeller] = useState<SachModel[]>([]);
	useEffect(() => {
		lay3SachBanChay()
			.then((response) => {
				setTop3BestSeller(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	return (
		<table className='table table-striped table-hover'>
			<thead>
				<tr>
					<th scope='col'>ID</th>
					<th scope='col'>ẢNH</th>
					<th scope='col'>TÊN SÁCH</th>
					<th scope='col'>ĐÃ BÁN</th>
				</tr>
			</thead>
			<tbody>
				{top3BestSeller.map((book) => {
					return (
						<tr key={book.maSach}>
							<th scope='row'>{book.maSach}</th>
							<td>
								<Link
									to={`/book/${book.maSach}`}
									className='d-inline text-black'
								>
									<img src={book.thumbnail} alt='' width={30} />
								</Link>
							</td>
							<Tooltip title={book.tenSach} arrow>
								<td>
									<Link
										to={`/book/${book.maSach}`}
										className='d-inline text-black'
									>
										<TextEllipsis
											text={book.tenSach + ""}
											limit={25}
										/>
									</Link>
								</td>
							</Tooltip>
							<td>{book.soLuongBan}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default Top3BestSeller;
