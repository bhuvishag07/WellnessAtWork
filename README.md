# WellnessAtWork — Corporate Employee Wellness Platform

## Case Study 72: Full Stack & Backend Engineering Implementation
**Student:** Bhuvisha Manish Gohil
**Course:** B.Tech Computer Science & Engineering (Second Year)
**Institution:** ITM Skills University

---

## 🔗 Live Application Links

- **Frontend Web Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Base:** [http://localhost:7500/api](http://localhost:7500/api)
- **API Health Check:** [http://localhost:7500/api/health](http://localhost:7500/api/health)
- **OpenAPI 3.0 Documentation:** `backend/docs/openapi.json`
- **Postman Collection:** `backend/docs/postman_collection.json`

---

## 👥 Demo Credentials

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Employee** | `bhuvisha.gohil@company.com` | `Wellness#2026!` | Dashboard, challenges, activity logging, rewards, sessions, settings |
| **HR Administrator** | `admin.hr@company.com` | `AdminPassword#2026` | Admin command center, challenge creation, executive reports, webinars |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS + Glassmorphism Aesthetic
- **Routing:** React Router v7
- **Real-Time Client:** Socket.io-client (connecting to `http://localhost:7500`)
- **Icons & Effects:** Lucide React, Canvas Confetti

### Backend
- **Server:** Node.js + Express.js running on `PORT=7500`
- **Database:** MongoDB Community (v8.0) with Mongoose ODM
- **Authentication:** JWT (HTTP-Only Cookie + Bearer fallback) & Firebase Admin SDK
- **Real-Time Engine:** Socket.io WebSockets
- **Document Generation:** PDFKit for executive reports, RFC-4180 CSV serializer

---

## 🚀 Running the Project

```bash
# 1. Start MongoDB
brew services start mongodb-community@8.0

# 2. Seed Database
cd backend
npm run seed

# 3. Start Backend (Port 7500)
npm run dev

# 4. In a separate terminal, start Frontend (Port 5173)
cd ..
npm run dev
```
