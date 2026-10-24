# WellnessAtWork — Backend System Architecture

## Case Study 72: Corporate Employee Wellness Platform
**Full Stack & Backend Engineering Implementation**
**Student Context:** Bhuvisha Manish Gohil — Second Year B.Tech Computer Science & Engineering (ITM Skills University)

---

## 1. Project Overview & Architecture

WellnessAtWork is an enterprise corporate wellness platform built with a high-performance, modular backend in Node.js, Express, MongoDB (Mongoose), JWT, and Socket.io. It replaces all mock states with an authoritative server-side rules engine for biometric telemetry, points ledgers, privacy firewalls, and real-time events.

```text
React (Vite :5173)  <-- WebSocket / REST (HTTP-Only Cookie + Bearer) --> Express Backend (:7500)
                                                                           │
         ┌───────────────────┬───────────────────┬─────────────────────────┤
         ▼                   ▼                   ▼                         ▼
   MongoDB/Mongoose     Socket.io Server   Firebase Admin SDK      PDFKit / CSV Streamer
  (Authoritative DB)   (Real-Time Engine)   (FCM Push / Auth)      (Audit Reports)
```

---

## 2. Directory Structure

```text
backend/
├── docs/
│   ├── openapi.json                 # Complete OpenAPI 3.0 API Specification
│   └── postman_collection.json      # Postman Collection for automated testing
├── scripts/
│   └── seed.js                      # Realistic seed script populating all collections
├── src/
│   ├── config/
│   │   ├── db.js                    # MongoDB Mongoose connection
│   │   └── firebase.js              # Firebase Admin SDK with safe fallback
│   ├── controllers/                 # REST Controller implementations
│   │   ├── activityController.js
│   │   ├── authController.js
│   │   ├── challengeController.js
│   │   ├── checkInController.js
│   │   ├── leaderboardController.js
│   │   ├── notificationController.js
│   │   ├── pointController.js
│   │   ├── reportController.js
│   │   ├── resourceController.js
│   │   ├── rewardController.js
│   │   ├── sessionController.js
│   │   ├── teamController.js
│   │   ├── userController.js
│   │   ├── wearableController.js
│   │   └── webinarController.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT cookie/bearer validation & role RBAC
│   │   └── errorHandler.js          # Centralized error handler
│   ├── models/                      # 13 Authoritative Mongoose Models
│   │   ├── ActivityLog.js
│   │   ├── Challenge.js
│   │   ├── MentalHealthCheckIn.js   # Cryptographically decoupled zero-identity model
│   │   ├── Notification.js
│   │   ├── PointTransaction.js
│   │   ├── Reward.js
│   │   ├── RewardLedger.js
│   │   ├── SessionBooking.js
│   │   ├── Team.js
│   │   ├── User.js
│   │   ├── UserChallenge.js
│   │   ├── Webinar.js
│   │   └── WellnessResource.js
│   ├── routes/                      # Modular API routing mounted under /api
│   ├── services/                    # Business logic and aggregation services
│   ├── sockets/
│   │   └── socketHandler.js         # Socket.io room management & broadcast engine
│   ├── utils/
│   │   ├── apiResponse.js           # Consistent JSON responses
│   │   ├── exportHelpers.js         # Real CSV & PDFKit executive report generators
│   │   └── pointsCalculator.js      # Authoritative rules engine for activity points
│   ├── app.js                       # Express app configuration & middleware
│   └── server.js                    # Server bootstrap on PORT 7500
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 3. Technology Stack

- **Runtime & Framework:** Node.js (v20+), Express.js (v4.21)
- **Database:** MongoDB Community (v8.0) with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, and Firebase Admin SDK
- **Real-Time Synchronisation:** Socket.io (v4.8) WebSockets
- **Document Exporting:** `pdfkit` for server-side PDF generation, custom RFC-4180 CSV serializer
- **Logging & Security:** `morgan`, `cors` with credentials, `cookie-parser`

---

## 4. Setup & Running Locally

### 4.1 Prerequisites
- MongoDB running on `mongodb://127.0.0.1:27017`
- Node.js installed

### 4.2 Installation
```bash
# Install backend dependencies
cd backend
npm install

# Seed the database
npm run seed

# Start development server
npm run dev
# OR production start
npm start
```

### 4.3 Environment Variables (`backend/.env`)
```text
PORT=7500
MONGODB_URI=mongodb://127.0.0.1:27017/wellness_at_work
JWT_SECRET=wellness_at_work_super_secret_jwt_key_2026_academic
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Live Firebase Admin Credentials
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## 5. Pre-Configured Demo Accounts

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Employee** | `bhuvisha.gohil@company.com` | `Wellness#2026!` | Logging, challenges, rewards, sessions, settings |
| **HR Administrator** | `admin.hr@company.com` | `AdminPassword#2026` | Challenge wizard, executive reports, webinars, notifications |

---

## 6. Real-Time Socket.io Events

The platform broadcasts and listens to the following events on `http://localhost:7500`:

1. `activity:logged`: Broadcasts colleague activity and updates team milestones.
2. `leaderboard:updated`: Notifies clients of point changes to re-sort standings.
3. `challenge:joined`: Dispatches live participant count updates.
4. `challenge:milestone`: Alerts when users cross 25%, 50%, or 75% thresholds.
5. `challenge:completed`: Triggers celebration and bonus credits.
6. `notification:push`: Delivers targeted alerts to individual user rooms (`user:<id>`).
7. `reward:redeemed`: Broadcasts company incentive claims.
8. `session:updated`: Synchronizes slot availability.

---

## 7. Strict Privacy & Confidentiality Architecture

The implementation strictly satisfies corporate mental health compliance:
1. **Mental Health Check-Ins (`MentalHealthCheckIn`):** Stores wellbeing ratings and stress scores **without any user foreign keys** (`userId`, `email`). Individual responses can never be tied back to an employee.
2. **Counseling Bookings (`SessionBooking`):** Booking details are firewalled. Regular employees can never view another employee's appointment, and organizational reports aggregate only headcount figures.
3. **Leaderboard Privacy:** Users can toggle `leaderboardVisibility` in Settings; when false, their name is obfuscated as "Anonymous Colleague".
