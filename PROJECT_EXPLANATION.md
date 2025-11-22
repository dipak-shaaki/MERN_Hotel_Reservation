# MERN Hotel Reservation System - Technical Explanation

## Overview
This is a **MERN Stack** application (MongoDB, Express, React, Node.js) for restaurant online reservation management.

---

## 📚 TABLE OF CONTENTS
1. [JavaScript & Node.js](#javascript--nodejs)
2. [Express.js](#expressjs)
3. [MongoDB & Mongoose](#mongodb--mongoose)
4. [React.js](#reactjs)
5. [Data Flow](#data-flow)
6. [Interview Talking Points](#interview-talking-points)

---

## JavaScript & Node.js

### What is Node.js?
Node.js is a **JavaScript runtime** that allows you to run JavaScript on the **server-side** (backend). Traditionally, JavaScript ran only in browsers.

### How it's used in this project:

**File: `backend/server.js`**
```javascript
import app from "./app.js";

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
})
```

**Explanation:**
- `import` - ES6 module syntax to import the Express app
- `app.listen()` - Node.js method that starts a server on a specific port
- `process.env.PORT` - Node.js global object to access environment variables
- When you run `npm run dev`, Node.js executes this file and keeps the server running

### ES6 Features Used:
```javascript
// 1. Arrow Functions
const handleReservation = async (e) => {
    // code here
}

// 2. Async/Await (modern promise handling)
const send_reservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.create({ firstName, lastName, email, date, time, phone });
        // waits for database operation to complete
    } catch (error) {
        return next(error);
    }
}

// 3. Destructuring
const { firstName, lastName, email, date, time, phone } = req.body;
// Extract values from object instead of: req.body.firstName, req.body.lastName, etc.

// 4. Template Literals
console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
// Instead of: console.log("SERVER HAS STARTED AT PORT " + process.env.PORT);

// 5. Spread Operator
await Promise.all([
    transporter.sendMail(customerMailOptions),
    transporter.sendMail(restaurantMailOptions)
]);
// Send multiple emails simultaneously
```

---

## Express.js

### What is Express.js?
Express is a **Node.js framework** that makes it easy to build web servers and APIs. It handles routing, middleware, and HTTP requests/responses.

### How it's used in this project:

**File: `backend/app.js`**
```javascript
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();

// ============ MIDDLEWARE SETUP ============
// 1. CORS Middleware - Allow requests from frontend
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 2. Body Parser Middleware - Parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============
// 3. API Routes
app.use("/api/v1/reservation", reservationRouter);

// 4. Health Check Endpoint
app.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN"
  })
})

// ============ DATABASE CONNECTION ============
dbConnection();

// ============ ERROR HANDLING ============
// 5. Global Error Middleware (must be last)
app.use(errorMiddleware);

export default app;
```

**What Each Middleware Does:**

| Middleware | Purpose | Example |
|-----------|---------|---------|
| `cors()` | Allows cross-origin requests (frontend talking to backend) | Frontend at localhost:5173 can call API at localhost:4000 |
| `express.json()` | Parses incoming JSON request body | `{ "firstName": "John", "lastName": "Doe" }` becomes accessible via `req.body` |
| `errorMiddleware` | Catches and handles errors globally | If reservation creation fails, error is caught and user gets proper error message |

### Routing in Express:

**File: `backend/routes/reservationRoute.js`**
```javascript
import express from "express";
import send_reservation from "../controller/reservation.js";

const router = express.Router();

// Define POST endpoint for reservations
router.post("/send", send_reservation);

export default router;
```

**How it works:**
- When user submits reservation form from frontend, a POST request is sent to: `http://localhost:4000/api/v1/reservation/send`
- Express matches this URL to the router
- Executes the `send_reservation` controller function

### Request/Response Cycle:

```javascript
// FILE: backend/controller/reservation.js

const send_reservation = async (req, res, next) => {
  // ========== REQUEST HANDLING ==========
  // Extract data from request body
  const { firstName, lastName, email, date, time, phone } = req.body;
  
  // Validate data
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
    // 400 = Bad Request (client error)
  }

  try {
    // ========== BUSINESS LOGIC ==========
    // Create reservation in database
    const reservation = await Reservation.create({ 
      firstName, lastName, email, date, time, phone 
    });

    // Send emails
    const transporter = createTransporter();
    await Promise.all([
      transporter.sendMail(customerMailOptions),  // Email to customer
      transporter.sendMail(restaurantMailOptions)  // Email to restaurant
    ]);

    // ========== RESPONSE SENDING ==========
    // Send success response to client
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
      reservationId: reservation._id
    });
    // 201 = Created (successful creation)
    
  } catch (error) {
    return next(error);  // Pass error to error middleware
  }
};
```

**Key Concepts:**
- **req** (Request) - Data from client (form data, query params, etc.)
- **res** (Response) - Data sent back to client
- **next** - Passes control to next middleware/function
- **Status codes**: 200 (OK), 201 (Created), 400 (Bad Request), 500 (Server Error)

---

## MongoDB & Mongoose

### What is MongoDB?
MongoDB is a **NoSQL database** that stores data as **JSON-like documents** instead of tables (like SQL). Perfect for flexible, real-time applications.

### What is Mongoose?
Mongoose is a **Node.js library** that makes it easier to work with MongoDB by providing:
- Schema validation
- Type casting
- Query building

### How it's used in this project:

**File: `backend/models/reservation.js`**
```javascript
import mongoose from "mongoose";
import validator from "validator";

// ========== SCHEMA DEFINITION ==========
// Define what data a reservation should contain
const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,  // Must provide this
    minLength: [3, "First name must be of at least 3 Characters."],
    maxLength: [30, "First name cannot exceed 30 Characters."],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name must be of at least 3 Characters."],
    maxLength: [30, "Last name cannot exceed 30 Characters."],
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide a valid email"],  // Custom validation
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number must contain at least 10 digits."],
    maxLength: [15, "Phone number cannot exceed 15 digits."],
  },
});

// ========== MODEL CREATION ==========
// Create a model from schema (this is what we use to interact with database)
export const Reservation = mongoose.model("Reservation", reservationSchema);
```

**Database Connection:**

**File: `backend/database/dbConnection.js`**
```javascript
import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "RESERVATIONS",  // Database name
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Some error occurred while connecting to database: ${err}`);
    });
};
```

**How Data is Created/Read:**

```javascript
// ========== CREATE (INSERT) ==========
// When user submits reservation form
const reservation = await Reservation.create({ 
  firstName: "John", 
  lastName: "Doe", 
  email: "john@example.com",
  date: "2025-11-25",
  time: "18:00",
  phone: "1234567890"
});
// Returns: { _id: "xyz123", firstName: "John", ...other fields }

// ========== READ (FIND) ==========
// Get all reservations
const allReservations = await Reservation.find();

// Get specific reservation by ID
const reservation = await Reservation.findById("xyz123");

// Find with conditions
const dinnerReservations = await Reservation.find({ time: "18:00" });

// ========== UPDATE ==========
const updated = await Reservation.findByIdAndUpdate(
  "xyz123",
  { date: "2025-11-26" },
  { new: true }  // Return updated document
);

// ========== DELETE ==========
await Reservation.findByIdAndDelete("xyz123");
```

**MongoDB vs SQL Comparison:**

| Operation | SQL | MongoDB |
|-----------|-----|---------|
| Create Table | `CREATE TABLE reservations (...)` | Schema definition in Mongoose |
| Insert | `INSERT INTO reservations VALUES (...)` | `Reservation.create({...})` |
| Select | `SELECT * FROM reservations` | `Reservation.find()` |
| Update | `UPDATE reservations SET...` | `Reservation.findByIdAndUpdate()` |
| Delete | `DELETE FROM reservations` | `Reservation.findByIdAndDelete()` |

---

## React.js

### What is React?
React is a **frontend JavaScript library** for building interactive user interfaces with **reusable components** and **state management**.

### How it's used in this project:

**File: `frontend/src/App.jsx`**
```javascript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home/Home';
import MenuPage from './Pages/Menu/MenuPage';
import NotFound from './Pages/NotFound/NotFound';
import Success from './Pages/Success/Success';
import './App.css'

const App = () => {
  return (
    <>
      <Router>  {/* Enables routing between pages */}
        <Routes>  {/* Define which component to show for each route */}
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/success' element={<Success />} />
          <Route path='*' element={<NotFound />} />  {/* Catch-all for 404 */}
        </Routes>
        <Toaster />  {/* Toast notification system */}
      </Router>
    </>
  )
}

export default App
```

**Key Concepts:**
- **Component** - Reusable piece of UI (like `<Home />`, `<MenuPage />`)
- **Routing** - Navigate between different pages without page reload
- **JSX** - Mix HTML and JavaScript

### React Component Example:

**File: `frontend/src/components/Reservation.jsx`**
```javascript
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  // ========== STATE MANAGEMENT ==========
  // useState hook to manage form data
  const [firstName, setFirstName] = useState("");  // Empty string initially
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  
  const navigate = useNavigate();  // Hook to navigate to different page

  // ========== FORM SUBMISSION HANDLER ==========
  const handleReservation = async (e) => {
    e.preventDefault();  // Prevent page reload

    // ========== CLIENT-SIDE VALIDATION ==========
    if (!firstName || !lastName || !email || !date || !time || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      // ========== API CALL TO BACKEND ==========
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/reservation/send",
        { firstName, lastName, email, phone, date, time },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,  // Send cookies
        }
      );
      
      // ========== SUCCESS HANDLING ==========
      toast.success(data.message);  // Show success notification
      
      // Clear form fields
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setTime("");
      setDate("");
      
      // Navigate to success page
      navigate("/success");
      
    } catch (error) {
      // ========== ERROR HANDLING ==========
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  // ========== JSX (HTML STRUCTURE) ==========
  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/breakfast1.png" alt="delicious breakfast" />
        </div>
        <div className="banner">
          <div className="enhanced-reservation-form">
            <h1>MAKE A RESERVATION</h1>
            <p>For Further Questions, Please Call</p>
            
            {/* FORM */}
            <form onSubmit={handleReservation}>
              {/* First Name & Last Name Row */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}  // Update state on input change
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="reserve-button">
                RESERVE NOW
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
```

**React Concepts:**

| Concept | Explanation |
|---------|-------------|
| **State** | Data that changes over time (form inputs) |
| **Hook** | `useState` - function to manage state |
| **Props** | Pass data from parent to child component |
| **Event Handler** | `onChange`, `onSubmit` - handle user interactions |
| **Conditional Rendering** | Show/hide components based on state |
| **Component Lifecycle** | `useEffect` - run code when component mounts/updates |

---

## Data Flow

### Complete Reservation Flow:

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. USER INTERACTION (Frontend - React)                              │
├─────────────────────────────────────────────────────────────────────┤
│ User fills reservation form and clicks "RESERVE NOW"                │
│ - firstName, lastName, email, date, time, phone                     │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      │ axios.post() - HTTP POST Request
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. API REQUEST SENT (Network Layer)                                 │
├─────────────────────────────────────────────────────────────────────┤
│ POST http://localhost:4000/api/v1/reservation/send                  │
│ Body: { firstName, lastName, email, date, time, phone }             │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      │ Express Router matches URL
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. BACKEND PROCESSING (Express + Node.js)                           │
├─────────────────────────────────────────────────────────────────────┤
│ a) Route handler receives request                                    │
│    - Express parses JSON body                                        │
│    - Middleware processes it                                         │
│                                                                       │
│ b) Controller validates data                                         │
│    - Check if all fields are provided                                │
│    - Validate email format                                           │
│    - Validate phone number                                           │
│                                                                       │
│ c) Database operation (MongoDB)                                      │
│    - Mongoose creates document in collection                         │
│    - MongoDB validates schema constraints                            │
│    - Document stored with unique ID                                  │
│                                                                       │
│ d) Send emails (Nodemailer)                                          │
│    - Email to customer (confirmation)                                │
│    - Email to restaurant (notification)                              │
│                                                                       │
│ e) Send JSON response back                                           │
│    { success: true, message: "...", reservationId: "xyz" }          │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      │ HTTP Response with status 201 (Created)
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. RESPONSE HANDLING (Frontend - React)                             │
├─────────────────────────────────────────────────────────────────────┤
│ a) axios receives response                                           │
│ b) Show success toast notification                                   │
│ c) Clear form fields (setXxx(""))                                   │
│ d) Navigate to /success page                                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Code Example of Complete Flow:

```javascript
// ===== FRONTEND (React) =====
// User submits form
const handleReservation = async (e) => {
  e.preventDefault();
  
  // Make API call
  const { data } = await axios.post(
    "http://localhost:4000/api/v1/reservation/send",
    { firstName, lastName, email, phone, date, time }
  );
  
  // Handle response
  if (data.success) {
    navigate("/success");
  }
};

// ===== NETWORK =====
// HTTP POST Request sent over internet

// ===== BACKEND (Express) =====
// Route matches the URL
router.post("/send", send_reservation);

// Controller processes the request
const send_reservation = async (req, res, next) => {
  // Validate
  const { firstName, lastName, email, date, time, phone } = req.body;
  
  // Create in database
  const reservation = await Reservation.create({ 
    firstName, lastName, email, date, time, phone 
  });
  
  // Send emails
  await transporter.sendMail(customerEmail);
  await transporter.sendMail(restaurantEmail);
  
  // Send response
  res.status(201).json({
    success: true,
    message: "Reservation Sent Successfully!",
    reservationId: reservation._id
  });
};

// ===== FRONTEND (React) =====
// Response received, show success and navigate
toast.success("Reservation Sent Successfully!");
navigate("/success");
```

---

## Interview Talking Points

### ✅ How to Explain Each Technology:

#### 1. **JavaScript & Node.js**
**Question:** "How is JavaScript used in this project?"

**Answer:**
"JavaScript is used in both frontend and backend. On the backend, I use Node.js which is a JavaScript runtime that allows JavaScript to run outside the browser. In this project:
- I use modern JavaScript (ES6) features like async/await, arrow functions, and destructuring
- Node.js powers the server and handles HTTP requests
- I use Express.js (Node.js framework) to build APIs
- For example, when a user submits a reservation, Node.js processes it, validates data, and sends emails"

---

#### 2. **Express.js**
**Question:** "How does Express.js work in your project?"

**Answer:**
"Express is a web framework for Node.js that makes building APIs easier. It handles:
1. **Routing**: Defines endpoints like `/api/v1/reservation/send`
2. **Middleware**: Processes requests before they reach the handler (CORS, JSON parsing)
3. **Request/Response**: Handles incoming HTTP requests and sends responses

In my project:
- I define routes for reservation endpoints
- Use middleware to parse JSON and handle errors
- When a request comes to `/api/v1/reservation/send`, Express routes it to the controller
- The controller processes the business logic and sends back a JSON response

Code example:
```javascript
app.use(express.json());  // Middleware to parse JSON
router.post("/send", send_reservation);  // Route definition
```"

---

#### 3. **MongoDB & Mongoose**
**Question:** "How do you store and retrieve data?"

**Answer:**
"I use MongoDB, a NoSQL database, to store reservation data. It stores data as JSON-like documents.

To make working with MongoDB easier, I use Mongoose which:
1. **Defines Schema**: Specifies what fields a reservation should have
2. **Validates Data**: Ensures data meets requirements (email format, phone length)
3. **Provides Query Methods**: `.find()`, `.create()`, `.findByIdAndUpdate()`

In my project:
- Schema defines: firstName, lastName, email, date, time, phone with validations
- When user submits reservation, Mongoose creates a document in MongoDB
- I can query all reservations or find specific ones by date/email

Code example:
```javascript
const reservation = await Reservation.create({...});  // Insert
const allReservations = await Reservation.find();  // Read
await Reservation.findByIdAndUpdate(id, {...});  // Update
```"

---

#### 4. **React.js**
**Question:** "How does React work in your frontend?"

**Answer:**
"React is a library for building interactive user interfaces with reusable components.

Key concepts I use:
1. **Components**: Reusable UI pieces (Reservation form, Navbar, etc.)
2. **State**: Data that changes (form inputs)
3. **Hooks**: Functions like `useState` to manage state
4. **Event Handlers**: `onChange`, `onSubmit` to respond to user interactions
5. **Axios**: Library to make API calls to backend

In my project:
- Reservation component has form fields as state
- When user types in input, state updates with `setFirstName(value)`
- On form submit, I validate data then call backend API with axios
- Response from backend triggers navigation or shows error

Code example:
```javascript
const [firstName, setFirstName] = useState("");  // State
const handleReservation = async (e) => {  // Event handler
  const { data } = await axios.post(...);  // API call
  navigate("/success");  // Update UI based on response
};
```"

---

#### 5. **Complete Data Flow**
**Question:** "Explain how data flows from frontend to backend and back?"

**Answer:**
"Here's the complete flow:

1. **User types in form** (Frontend - React)
   - React state updates with each keystroke
   
2. **User clicks 'Reserve Now'** (Frontend)
   - Form validation happens
   - axios sends POST request to backend with form data
   
3. **Request reaches backend** (Express)
   - Express receives the request
   - Middleware parses JSON body
   - Routes to controller function
   
4. **Controller processes** (Node.js)
   - Validates all fields again (server-side security)
   - Creates reservation in MongoDB using Mongoose
   
5. **Database operation** (MongoDB)
   - Document is saved in 'reservations' collection
   - Returns saved document with ID
   
6. **Send emails** (Nodemailer)
   - Email to customer confirming reservation
   - Email to restaurant notifying about reservation
   
7. **Send response back** (Express)
   - JSON response: {success: true, message: '...'}
   
8. **Frontend receives response** (React)
   - If successful, show toast notification
   - Clear form and navigate to success page
   - If error, show error toast

This is a complete cycle of client-server communication!"

---

#### 6. **Security & Validation**
**Question:** "Where do you validate data?"

**Answer:**
"I validate at multiple layers:

1. **Frontend Validation** (React)
   - Check if fields are empty
   - Validate email format with regex
   - Validate phone number length
   - Gives immediate feedback to user
   
2. **Backend Validation** (Express)
   - Never trust frontend validation
   - Check again if fields are provided
   - Mongoose schema validates:
     - Email is valid email format
     - Phone is 10-15 digits
     - Required fields are provided
   
3. **Database Validation** (MongoDB/Mongoose)
   - Schema constraints prevent invalid data
   - Type casting ensures correct data types

This defense-in-depth approach prevents hacks and ensures data integrity."

---

### Common Interview Questions & How to Answer:

**Q: "Why did you use MongoDB instead of SQL?"**
A: "MongoDB is flexible and great for this project because:
- Stores data as JSON documents (similar to JavaScript objects)
- Easy to add new fields later without migrations
- Perfect for rapid development
- Good for real-time data"

**Q: "How does your app handle errors?"**
A: "I have error handling at multiple layers:
- Frontend: Try-catch blocks in async functions
- Backend: Express error middleware catches all errors
- Database: Mongoose validates schemas
- User gets proper error messages instead of app crashing"

**Q: "How does the reservation workflow work?"**
A: "User fills form → Frontend validation → API call → Backend validation → Database save → Emails sent → Success response → Frontend shows success message and redirects"

**Q: "What happens if the database connection fails?"**
A: "Mongoose .catch() block logs error and user sees 'database connection failed' message instead of hanging"

---

### Summary for Interview:

**Say this:**
"I built a MERN stack restaurant reservation system. The frontend is built with React and uses axios to communicate with the backend API. The backend is Express.js running on Node.js, which handles routing and business logic. Data is stored in MongoDB using Mongoose for schema validation. The complete flow is: user submits form → React validates → Axios sends request → Express routes → Controller validates → Mongoose saves to MongoDB → Emails are sent → Response sent back → React shows confirmation."

This demonstrates understanding of:
✅ Full stack architecture
✅ How technologies communicate
✅ Data flow
✅ Validation layers
✅ Real-world functionality

---

## Quick Reference Code Snippets

### Backend Architecture:
```
server.js          → Starts Node.js server
  ↓
app.js            → Express setup, middleware, routes
  ↓
routes/            → Define API endpoints
  ↓
controller/        → Business logic
  ↓
models/            → Mongoose schemas
  ↓
database/          → MongoDB connection
```

### Frontend Architecture:
```
App.jsx           → Routes between pages
  ↓
Pages/            → Page components (Home, Menu, etc.)
  ↓
Components/       → Reusable components (Reservation, Navbar, etc.)
  ↓
axios API calls   → Communicate with backend
  ↓
React State       → Manage form data
  ↓
CSS               → Styling
```

---

Good luck with your interviews! 🚀
