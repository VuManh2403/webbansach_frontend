import React from 'react';
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import List from "../product/List";

function HomePage() {
    return(
      <div>
          <Banner></Banner>
          <Carousel></Carousel>
          <List></List>
      </div>
    );
}

export default HomePage;