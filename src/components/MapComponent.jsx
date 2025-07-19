import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../../supabaseClient"; // ← Your initialized Supabase client
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

  // Get User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setUserPosition([10.7602, 78.8142]);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn("Geolocation not supported");
      setUserPosition([10.7602, 78.8142]);
    }
  }, []);

  // Fetch cars and setup realtime subscription
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
        (payload) => {
          console.log("Realtime Update:", payload);
          fetchCars(); // re-fetch on insert/update/delete
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full h-[calc(100vh)] overflow-hidden">
      {userPosition && (
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

          <Marker position={userPosition} icon={userIcon}>
            <Popup>You are here 🚶</Popup>
          </Marker>

          {cars.map((car) => (
            <Marker
              key={car.id}
              position={[car.location.latitude, car.location.longitude]}
              icon={carIcon}
            >
              <Popup>
                🚗 <strong>{"Electric Taxi"}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      <RequestButton userPosition={userPosition} />
    </div>
  );
};

export default MapComponent;
