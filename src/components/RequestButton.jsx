import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const TWO_MINUTES_MS = 2 * 60 * 1000;

const RequestButton = ({ userPosition }) => {
  const [rideId, setRideId] = useState(null);
  const [requestedAt, setRequestedAt] = useState(null); // track timestamp
  const [loading, setLoading] = useState(false);

  // Returns true if the ride was requested more than 2 minutes ago
  const isExpired = (timestamp) => {
    if (!timestamp) return true;
    return Date.now() - new Date(timestamp).getTime() > TWO_MINUTES_MS;
  };

  // Fetch current user's active ride on mount / position change
  useEffect(() => {
    const fetchExistingRide = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated:", userError);
        return;
      }

      const { data: existingRide, error: checkError } = await supabase
        .from("riders")
        .select("id, requested_at")
        .eq("requested_by", user.id)
        .eq("status", "waiting")
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = no rows found — not an error
        console.error("Error checking existing ride:", checkError);
        return;
      }

      if (existingRide) {
        if (isExpired(existingRide.requested_at)) {
          // Auto-clean expired ride from DB
          await supabase.from("riders").delete().eq("id", existingRide.id);
          setRideId(null);
          setRequestedAt(null);
        } else {
          setRideId(existingRide.id);
          setRequestedAt(existingRide.requested_at);
        }
      }
    };

    fetchExistingRide();
  }, [userPosition]);

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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      alert("User not authenticated!");
      return;
    }

    // Safety check: no duplicate active rides
    const { data: existingRides, error: checkError } = await supabase
      .from("riders")
      .select("id, requested_at")
      .eq("requested_by", user.id)
      .eq("status", "waiting");

    if (checkError) {
      console.error("Error checking existing ride:", checkError);
      alert("Failed to check existing ride request.");
      return;
    }

    const activeRide = existingRides?.find((r) => !isExpired(r.requested_at));
    if (activeRide) {
      alert("You already have a pending ride request.");
      return;
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("riders")
      .insert([
        {
          latitude: userPosition[0],
          longitude: userPosition[1],
          requested_at: now,
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
      setRequestedAt(data.requested_at);
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
      setRequestedAt(null);
      alert("Ride marked as done and removed.");
      
    }
  };

  // Show "Request Ride" if no active ride OR if the existing ride has expired
  const showRequestButton = !rideId || isExpired(requestedAt);

  return (
    <button
      onClick={handleButtonClick}
      disabled={loading}
      className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 px-5 py-3 font-semibold rounded-full shadow-lg z-[1000] text-white transition-all duration-200
        ${showRequestButton ? "bg-blue-600" : "bg-green-600"}
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
      ) : showRequestButton ? (
        "Request Ride"
      ) : (
        "Done Ride"
      )}
    </button>
  );
};

export default RequestButton;
