import React, {useState} from 'react';
import './App.css';
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";

function App() {
    // dung useState de tao ra bien
    // bien se anh huong den Navbar, HomePage
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

    return (
        <div className='App'>
            <Navbar tuKhoaTimKiem={tuKhoaTimKiem}  setTuKhoaTimKiem={setTuKhoaTimKiem}/>
            <HomePage tuKhoaTimKiem={tuKhoaTimKiem} />
            <Footer/>
        </div>
    );
}

export default App;
