# 💼 Smart Placement Tracker — MERN Stack

A full-stack campus placement management system with role-based access for **students** and **admins**.

---

## 🚀 Features

### 🎓 Student
- Register and login securely
- Browse available job listings
- One-click apply with CGPA eligibility check
- Track application status (Applied → Interview → Selected / Rejected)

### 🛡️ Admin
- Post new job opportunities
- View all student applications
- Update application status in real time
- Filter applications by status

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |

---

## 🔐 How Auth Works

- On login, the server generates a JWT token containing the user's ID and role
- Token is stored in localStorage and attached to every API request via Axios interceptor
- Protected routes on both frontend (PrivateRoute) and backend (authMiddleware) check the token
- Role-based redirect — students go to `/student`, admins go to `/dashboard`

---

## 📂 Project Structure
smart-placement-tracker/
├── smart-placement-frontend/   # React app
│   └── src/
│       ├── pages/              # Home, Login, Signup, Dashboard, etc.
│       ├── components/         # Navbar, PrivateRoute, PublicRoute
│       └── services/           # Axios API instance
│
└── smart-placement-backend/    # Node + Express API
├── controllers/            # Business logic
├── routes/                 # API endpoints
├── models/                 # MongoDB schemas
└── middleware/             # JWT auth middleware

---

## ⚙️ How to Run Locally

### Backend
```bash
cd smart-placement-backend
npm install
# Create a .env file with:
# JWT_SECRET=your_secret
# MONGO_URI=your_mongodb_uri
# PORT=5000
npm run dev
```

### Frontend
```bash
cd smart-placement-frontend
npm install
npm start
```

---

## 📌 Future Enhancements
- Resume upload via Cloudinary
- Email notifications on status change
- Admin analytics dashboard
- AI-based job recommendations
