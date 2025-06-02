import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import {useAuth} from "../../utils/QuanLyDangNhap";
import FavoriteBooksList from "../product/FavoriteBooksList";

interface MyFavoriteBooksPageProps {}

const MyFavoriteBooksPage: React.FC<MyFavoriteBooksPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const { isLoggedIn } = useAuth();
	const navigation = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigation("/login");
		}
	});

	if (!isLoggedIn) {
		return null;
	}

	return (
		<>
			<FavoriteBooksList />
		</>
	);
};

export default MyFavoriteBooksPage;
