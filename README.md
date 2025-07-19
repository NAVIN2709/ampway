# 🚗⚡ AmpWay – NITT's Ola for Electric Buggies

AmpWay is a smart campus mobility solution that connects students at NIT Trichy with electric buggies in real-time. Instead of calling buggy drivers manually, students can post ride requests via the app. Drivers get notified instantly and can accept requests — enabling smooth, trackable, and fair rides across campus.

> 🛠️ Built with React + Supabase and deployed on Vercel.

---

## 🧠 Why AmpWay?

Currently, students need to call buggy drivers to request rides — causing:
- Long wait times
- Uncertainty about buggy availability
- No tracking or queue system

### ✅ AmpWay solves this by:
- Allowing students to **post ride requests** instantly
- Letting drivers **accept rides** through notifications
- Enabling **live buggy tracking** on a map
- Improving the **transparency** and **fairness** of campus transport

---

## ⚙️ Tech Stack

| Layer         | Tech                       |
|---------------|----------------------------|
| Frontend      | **React.js**               |
| Backend (DB)  | **Supabase** (PostgreSQL)  |
| Auth          | Supabase Auth (email/OTP)  |
| Realtime Data | Supabase Realtime (channels) |
| Hosting       | **Vercel** (frontend)      |
| Location      | Geolocation API / Capacitor (optional for mobile) |

---

## 🧭 Key Features

### 👨‍🎓 For Students
- 📍 View live location of available buggies
- 📝 Post a ride request with pickup/drop info
- 🔔 Get notified when a driver accepts
- 📄 View ride history

### 👨‍✈️ For Drivers
- 🔔 Get notified when students request rides
- ✅ Accept or decline ride requests
- 🧭 Navigate to student pickup location
- 📊 View ride stats/logs

---

## 📦 Project Structure

