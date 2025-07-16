import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import  RequestButton  from "./RequestButton";

const MapComponent = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [cars, setCars] = useState(null);

  // Marker Icons
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
          setUserPosition([10.7602, 78.8142]); // fallback: NIT Trichy
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setUserPosition([10.7602, 78.8142]);
    }
  }, []);

  // Live Fetch Cars from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cars"), (snapshot) => {
      const carData = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.carName,
            latitude: data.location?.latitude,
            longitude: data.location?.longitude,
          };
        })
        .filter((car) => car.latitude && car.longitude);
      setCars(carData);
    });

    return () => unsub();
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

          {/* User Marker */}
          <Marker position={userPosition} icon={userIcon}>
            <Popup>You are here 🚶</Popup>
          </Marker>

          {/* Car Markers from Firestore */}
          {cars &&
            cars.map((car) => (
              <Marker
                key={car.id}
                position={[car.latitude, car.longitude]}
                icon={carIcon}
              >
                <Popup>
                  🚗 <strong>{car.name || "Electric Taxi"}</strong>
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
