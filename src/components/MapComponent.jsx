import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../../supabaseClient";
import RequestButton from "./RequestButton";

const MapComponent = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [cars, setCars] = useState([]);

  const userIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const carIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please enable location access to continue.");
      },
      { enableHighAccuracy: true }
    );
  };

  // 🚗 Fetch cars + realtime
  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, latitude, longitude");

      if (error) {
        console.error("Error fetching cars:", error);
        return;
      }

      const validCars = data
        .filter((car) => car.latitude && car.longitude)
        .map((car) => ({
          id: car.id,
          location: {
            latitude: car.latitude,
            longitude: car.longitude,
          },
        }));

      setCars(validCars);
    };

    fetchCars();

    const channel = supabase
      .channel("cars-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cars" },
        () => {
          fetchCars();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ❌ Location not granted UI */}
      {!userPosition && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-[2000]">
          <p className="mb-4 text-center px-6 text-lg font-semibold">
            Enable location to find rides 🚕
          </p>

          <button
            onClick={requestLocation}
            className="bg-white text-black px-6 py-3 rounded-full font-semibold"
          >
            Enable Location 📍
          </button>
        </div>
      )}

      {/* ✅ Map */}
      {userPosition && (
        <>
          <MapContainer
            center={userPosition}
            zoom={17}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Marker */}
            <Marker position={userPosition} icon={userIcon}>
              <Popup>You are here 🚶</Popup>
            </Marker>

            {/* Cars */}
            {cars.map((car) => (
              <Marker
                key={car.id}
                position={[car.location.latitude, car.location.longitude]}
                icon={carIcon}
              >
                <Popup>🚗 Electric Buggie</Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Bottom Sheet */}
          <div className="request-button absolute bottom-15 left-0 w-full z-[1000] px-4">
            <RequestButton userPosition={userPosition} />
          </div>
        </>
      )}
    </div>
  );
};

export default MapComponent;