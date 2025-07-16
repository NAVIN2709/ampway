import React, { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path if needed

const RequestButton = ({ userPosition }) => {
  const [rideId, setRideId] = useState(null); // Store the Firestore doc ID of the ride

  const handleRequestRide = async () => {
    if (!userPosition) {
      alert("User location not available!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'rides'), {
        location: {
          latitude: userPosition[0],
          longitude: userPosition[1],
        },
        requestedAt: Timestamp.now(),
        status: 'waiting',
      });
      setRideId(docRef.id);
      alert('Ride requested successfully!');
    } catch (error) {
      console.error('Error adding ride:', error);
      alert('Failed to request ride.');
    }
  };

  const handleDoneRide = async () => {
    if (!rideId) return;

    try {
      await deleteDoc(doc(db, 'rides', rideId));
      setRideId(null);
      alert('Ride marked as done and removed.');
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert('Failed to complete ride.');
    }
  };

  return (
    <button
      onClick={rideId ? handleDoneRide : handleRequestRide}
      className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-5 py-3 font-semibold rounded-full shadow-lg z-[1000] ${
        rideId ? 'bg-green-600' : 'bg-blue-600'
      } text-white`}
    >
      {rideId ? 'Done Ride' : 'Request Ride'}
    </button>
  );
};

export default RequestButton;
