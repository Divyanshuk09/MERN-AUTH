import React from 'react';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import bgImg from '../assets/bg_image.jpg';

const Home = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
