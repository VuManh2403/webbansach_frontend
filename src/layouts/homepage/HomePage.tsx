import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import useScrollToTop from "../../hooks/ScrollToTop";
import HotBookList from "../product/HotBookList";
import NewBookList from "../product/NewBookList";
import BookList from "../product/BookList";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = (props) => {
    useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
    return (
        <>
            <div className='d-md-none d-sm-none d-lg-block'>
                {/* Banner */}
                <Banner />
                {/* Underline */}
                <div className='d-flex justify-content-center align-items-center pb-4'>
                    <hr className='w-100 mx-5' />
                </div>
            </div>
            {/* Slide img */}
            <div className='container'>
                <Carousel />
            </div>
            {/* Hot Product */}
            <HotBookList />
            {/* New Product */}
            <NewBookList />
            {/* Product List */}
            <BookList size={8} />
        </>
    );
};

export default HomePage;
