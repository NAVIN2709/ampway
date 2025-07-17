import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const RequestButton = ({ userPosition }) => {
  const [rideId, setRideId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      if (!rideId) {
        await handleRequestRide();
      } else {
        await handleDoneRide();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!userPosition) {
      alert("User location not available!");
      return;
    }

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      alert("User not authenticated!");
      return;
    }

    // Check if user already has a ride request with status "waiting"
    const { data: existingRides, error: checkError } = await supabase
      .from("riders")
      .select("id")
      .eq("requested_by", user.id)
      .eq("status", "waiting");

    if (checkError) {
      console.error("Error checking existing ride:", checkError);
      alert("Failed to check existing ride request.");
      return;
    }

    if (existingRides.length > 0) {
      alert("You already have a pending ride request.");
      return;
    }

    // Insert the ride
    const { data, error } = await supabase
      .from("riders")
      .insert([
        {
          latitude: userPosition[0],
          longitude: userPosition[1],
          requested_at: new Date().toISOString(),
          status: "waiting",
          requested_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding ride:", error);
      alert("Failed to request ride.");
    } else {
      setRideId(data.id);
      alert("Ride requested successfully!");
    }
  };

  const handleDoneRide = async () => {
    if (!rideId) return;

    const { error } = await supabase.from("riders").delete().eq("id", rideId);

    if (error) {
      console.error("Error deleting ride:", error);
      alert("Failed to complete ride.");
    } else {
      setRideId(null);
      alert("Ride marked as done and removed.");
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      disabled={loading}
      className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-5 py-3 font-semibold rounded-full shadow-lg z-[1000] text-white transition-all duration-200
    ${rideId ? "bg-green-600" : "bg-blue-600"}
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}
  `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : rideId ? (
        "Done Ride"
      ) : (
        "Request Ride"
      )}
    </button>
  );
};

export default RequestButton;
