import React from 'react';
import MapComponent from '../components/MapComponent';

const Home = () => {
  return (
    <div className="relative w-full h-[min-content] bg-black text-white">
      <div className="absolute top-0 left-0 p-4 z-[1000] flex justify-center w-100">
        <p className="text-md text-black font-bold">Welcome to AmpWay</p>
      </div>
      <MapComponent />
    </div>
  );
};

export default Home;
