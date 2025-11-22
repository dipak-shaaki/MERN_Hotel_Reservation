# MERN Stack Architecture Diagram & Quick Guide

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RESTAURANT RESERVATION SYSTEM                     │
│                              MERN STACK                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│         FRONTEND (React)             │    │        BACKEND (Node.js/Express)     │
│      Port: localhost:5173            │    │       Port: localhost:4000           │
├──────────────────────────────────────┤    ├──────────────────────────────────────┤
│ 1. User Interface                    │    │ 1. API Endpoints                     │
│    - Navbar (sticky)                 │    │    - POST /api/v1/reservation/send   │
│    - Hero Section                    │    │    - GET /api/v1/reservation         │
│    - About Section                   │    │    - DELETE /api/v1/reservation/:id  │
│    - Qualities Section               │    │                                      │
│    - Team Section                    │    │ 2. Middleware                        │
│    - Reservation Form                │    │    - CORS                            │
│    - Footer                          │    │    - JSON Parser                     │
│                                      │    │    - Error Handler                   │
│ 2. React Components                  │    │                                      │
│    - Stateful (with hooks)           │    │ 3. Controllers                       │
│    - Form handling                   │    │    - Business logic                  │
│    - Validation                      │    │    - Data validation                 │
│    - Event handlers                  │    │    - Database operations             │
│                                      │    │                                      │
│ 3. HTTP Requests                     │    │ 4. Routes                            │
│    - axios library                   │    │    - URL mapping                     │
│    - Send JSON data                  │    │    - Route handlers                  │
│    - Receive responses               │    │                                      │
│                                      │    │ 5. Error Handling                    │
│ 4. State Management                  │    │    - Global error middleware         │
│    - useState hooks                  │    │    - Try-catch blocks                │
│    - Form state                      │    │                                      │
│    - UI updates                      │    └──────────────────────────────────────┘
└──────────────────────────────────────┘
           │                                           │
           │         HTTP/HTTPS                        │
           │      (axios ↔ Express)                    │
           │                                           │
           └───────────────┬───────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │ JSON Data   │
                    │ Request/    │
                    │ Response    │
                    └──────┬──────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
    ┌──────▼──────────┐          ┌─────────▼─────────┐
    │   MONGODB       │          │   NODEMAILER      │
    │  (NoSQL DB)     │          │   (Email Service) │
    ├─────────────────┤          ├───────────────────┤
    │ Collection:     │          │ Sends emails to:  │
    │ Reservations    │          │ - Customer        │
    │                 │          │ - Restaurant      │
    │ Fields:         │          └───────────────────┘
    │ - firstName     │
    │ - lastName      │
    │ - email         │
    │ - date          │
    │ - time          │
    │ - phone         │
    │ - _id (auto)    │
    └─────────────────┘
```

---

## 📊 Data Flow Diagram

```
USER TYPES IN FORM (Frontend)
    ↓
React State Updates: firstName, lastName, email, date, time, phone
    ↓
USER CLICKS "RESERVE NOW"
    ↓
Event Handler: handleReservation()
    ↓
Frontend Validation:
  ✓ Check if all fields filled
  ✓ Validate email format
  ✓ Validate phone length
    ↓
axios.post() sends data to backend
    ↓
═══════════════════ NETWORK ═════════════════════════════════════════
    ↓
Express receives POST request
    ↓
Middleware processes:
  1. CORS check
  2. JSON parsing
    ↓
Router matches URL: /api/v1/reservation/send
    ↓
Controller: send_reservation()
    ↓
Backend Validation:
  ✓ Extract data from req.body
  ✓ Check all fields provided
  ✓ Validate email with validator library
  ✓ Validate phone with regex
    ↓
Mongoose Schema Validation:
  ✓ firstName: 3-30 chars
  ✓ email: valid email format
  ✓ phone: 10-15 digits
    ↓
Create MongoDB Document
    ↓
MongoDB saves to 'reservations' collection
    ↓
Returns: { _id: "auto-generated-id", firstName: "John", ...}
    ↓
Create Transporter (Nodemailer)
    ↓
Send 2 Emails Simultaneously:
  1. Customer Confirmation Email
  2. Restaurant Notification Email
    ↓
Express sends JSON Response (status 201)
  { success: true, message: "Reservation Sent!", reservationId: "..." }
    ↓
═══════════════════ NETWORK ═════════════════════════════════════════
    ↓
axios receives response in frontend
    ↓
.then() block executes:
  1. Show success toast: toast.success()
  2. Clear form: setFirstName(""), setLastName(""), etc.
  3. Navigate: navigate("/success")
    ↓
USER SEES SUCCESS PAGE
```

---

## 🔑 Key Concepts Explained

### 1️⃣ REQUEST OBJECT (req)
```javascript
// What the frontend sends
const data = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  date: "2025-11-25",
  time: "18:00",
  phone: "1234567890"
};

// Backend receives it in req.body
const { firstName, lastName, email, date, time, phone } = req.body;
```

### 2️⃣ RESPONSE OBJECT (res)
```javascript
// Backend sends back
res.status(201).json({
  success: true,
  message: "Reservation Sent Successfully!",
  reservationId: reservation._id
});

// Frontend receives it in data
const { data } = await axios.post(...);
console.log(data.success);  // true
console.log(data.message);  // "Reservation Sent Successfully!"
```

### 3️⃣ MIDDLEWARE FLOW
```
Request
  ↓
Middleware 1: cors()              → Check if request allowed
  ↓
Middleware 2: express.json()      → Parse JSON body
  ↓
Middleware 3: express.urlencoded() → Parse form data
  ↓
Route Handler                      → Process request
  ↓
Middleware 4: errorMiddleware()   → Handle errors
  ↓
Response sent to client
```

### 4️⃣ MONGODB OPERATIONS
```javascript
// CREATE - Insert new document
const newReservation = await Reservation.create({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  date: "2025-11-25",
  time: "18:00",
  phone: "1234567890"
});
// Returns: { _id: "xyz123", firstName: "John", ...}

// READ - Fetch documents
const allReservations = await Reservation.find();
const oneReservation = await Reservation.findById("xyz123");
const todaysReservations = await Reservation.find({ date: "2025-11-25" });

// UPDATE - Modify document
const updated = await Reservation.findByIdAndUpdate(
  "xyz123",
  { date: "2025-11-26" },
  { new: true }  // Return updated version
);

// DELETE - Remove document
await Reservation.findByIdAndDelete("xyz123");
```

### 5️⃣ REACT STATE & HOOKS
```javascript
// State Declaration
const [firstName, setFirstName] = useState("");

// State Update on User Input
<input 
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>

// Component Re-renders when state changes
// Old HTML: <input value="" />
// User types "John"
// setFirstName("John") is called
// Component re-renders with: <input value="John" />
```

---

## 🎯 Interview Quick Tips

**Explain like you're talking to someone who knows code:**

**Tech Stack:** "I built a MERN app - React frontend, Express/Node.js backend, MongoDB database."

**How requests work:** "User fills form → React validates → Axios sends POST request → Express routes to controller → Controller validates and creates MongoDB document → Response sent back → React navigates to success page."

**Database:** "Using MongoDB with Mongoose for schema validation. Stores reservations with fields like firstName, email, date, etc."

**Communication:** "Frontend and backend communicate via HTTP/JSON. Frontend uses axios to make requests, backend uses Express to handle them."

**Error Handling:** "Validation happens twice - frontend for UX, backend for security. Mongoose schema also validates. Global Express error middleware catches all errors."

---

## 📋 File Structure Quick Reference

```
Backend:
├── server.js              → Entry point (starts server)
├── app.js                 → Express app setup
├── config/
│   ├── .env              → Environment variables
│   └── emailConfig.js    → Email setup
├── database/
│   └── dbConnection.js   → MongoDB connection
├── models/
│   └── reservation.js    → Mongoose schema
├── routes/
│   └── reservationRoute.js → API endpoints
├── controller/
│   └── reservation.js    → Business logic
└── middlewares/
    └── error.js          → Error handling

Frontend:
├── src/
│   ├── App.jsx           → Main app, routing
│   ├── App.css           → Global styles
│   ├── main.jsx          → React entry point
│   ├── restApi.json      → Mock data
│   ├── components/       → Reusable components
│   └── Pages/            → Page components
└── public/               → Static files
```

---

Good luck explaining your project! 💪
