import React, { useState } from "react";
import MapComponent from "../components/MapComponent";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const drivers = [
    { name: "Driver 1", phone: "+919363859724" },
    { name: "Driver 2", phone: "+916369920672" },
  ];

  return (
    <div className="relative w-full h-screen bg-black text-white">

      {/* Header */}
      <div className="absolute top-0 left-0 p-4 z-[1000] flex justify-center w-full items-center">
        <p className="text-md text-black font-bold">Welcome to AmpWay</p>

        {/* Button to open modal */}
        <button
          onClick={() => setShowModal(true)}
          className="ml-4 px-3 py-1 bg-white text-sm rounded-xl"
        >
          <img src="/phone.svg" alt="Contact Drivers" className="w-5 h-5 inline-block" />
        </button>
      </div>

      <MapComponent />

      {/* 🔲 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000]">

          <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-sm relative">

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">
              Contact Drivers 🚗
            </h2>

            {/* Driver List */}
            <div className="flex flex-col gap-3">
              {drivers.map((driver, index) => (
                <a
                  key={index}
                  href={`tel:${driver.phone}`}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between items-center hover:bg-gray-200"
                >
                  <span>{driver.name}</span>
                  <span className="text-blue-600">{driver.phone}</span>
                </a>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;