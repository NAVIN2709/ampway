import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const TWO_MINUTES_MS = 2 * 60 * 1000;

const RequestButton = ({ userPosition }) => {
  const [rideId, setRideId] = useState(null);
  const [requestedAt, setRequestedAt] = useState(null);
  const [loading, setLoading] = useState(false);

  const isExpired = (timestamp) => {
    if (!timestamp) return true;
    return Date.now() - new Date(timestamp).getTime() > TWO_MINUTES_MS;
  };

  useEffect(() => {
    const fetchExistingRide = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("riders")
        .select("id, requested_at")
        .eq("requested_by", user.id)
        .eq("status", "waiting")
        .single();

      if (data) {
        if (isExpired(data.requested_at)) {
          await supabase.from("riders").delete().eq("id", data.id);
        } else {
          setRideId(data.id);
          setRequestedAt(data.requested_at);
        }
      }
    };

    fetchExistingRide();
  }, [userPosition]);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      if (!rideId || isExpired(requestedAt)) {
        await handleRequestRide();
      } else {
        await handleDoneRide();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!userPosition) return alert("Location not available");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Not logged in");

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

    if (!error) {
      setRideId(data.id);
      setRequestedAt(data.requested_at);
    }
  };

  const handleDoneRide = async () => {
    if (!rideId) return;

    await supabase.from("riders").delete().eq("id", rideId);

    setRideId(null);
    setRequestedAt(null);
  };

  const showRequestButton = !rideId || isExpired(requestedAt);

  return (
    <div className="absolute bottom-0 left-0 w-full z-[1000]">
      {/* Bottom Sheet */}
      <div className="bg-white text-black rounded-t-3xl p-5 shadow-2xl">

        {/* Status */}
        {!showRequestButton && (
          <p className="text-sm text-green-600 mb-2">
            🚗 Driver finding in progress...
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleButtonClick}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all
            ${showRequestButton ? "bg-black" : "bg-green-600"}
            ${loading ? "opacity-60" : "active:scale-95"}
          `}
        >
          {loading
            ? "Processing..."
            : showRequestButton
              ? "Request Ride 🚕"
              : "Cancel Ride ❌"}
        </button>
      </div>
    </div>
  );
};

export default RequestButton;
