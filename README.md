# 🎓 Academic Task & Habit Manager (ATHM)

ATHM is a comprehensive productivity tool designed specifically for students to organize their academic life. It bridges the gap between assignment tracking and personal habit formation, providing a unified platform to manage deadlines and build positive routines.

## 🚀 Key Features

### 📝 Task Management
* **Create, Read, Update, Delete (CRUD):** Full control over your academic tasks.
* **Smart Filtering:** Filter tasks by status (Pending, Completed, Missed), Subject, or Priority.
* **Priority System:** Visual indicators for High, Medium, and Low priority tasks.
* **Deadline Tracking:** Automatic detection of overdue tasks.

### 🔥 Habit Tracker
* **Streak System:** Builds consistency by tracking consecutive days of habit completion.
* **Daily Check-ins:** Simple interface to mark habits as done for the day.
* **Optimistic UI:** Instant visual feedback for smoother user experience.

### 🎨 User Experience
* **Dark Mode:** Fully responsive dark/light theme toggled via Context API.
* **Responsive Design:** Optimized for both desktop and mobile devices using Tailwind CSS.
* **Authentication:** Secure JWT-based Login and Registration system.

---

## 🛠️ Tech Stack

This project is built using the **MERN Stack**:

* **Frontend:**
    * [React.js](https://reactjs.org/) - Component-based UI library
    * [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
    * [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
    * [Axios](https://axios-http.com/) - Promise based HTTP client

* **Backend:**
    * [Node.js](https://nodejs.org/) - JavaScript runtime environment
    * [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
    * [Mongoose](https://mongoosejs.com/) - MongoDB object modeling tool

* **Database:**
    * [MongoDB](https://www.mongodb.com/) - NoSQL Database

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
Make sure you have **Node.js** installed on your computer.

### 2. Clone the Repository
```bash
git clone https://github.com/Mufu2005/ATHM.git
cd ATHM
```

### 3. Setup the Backend (Server)
Navigate to the server folder and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder and add your configuration:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm start
```
*(The server will run on http://localhost:5000)*

### 4. Setup the Frontend (Client)
Open a **new terminal**, navigate to the root folder (where the React app lives), and install dependencies:
```bash
npm install
```

Start the React application:
```bash
npm run dev
```
*(The app will usually run on http://localhost:5173)*

---

## 📂 Project Structure

```bash
ATHM/
├── src/
│   ├── components/    # Reusable UI components (Navbar, Modals, Cards)
│   ├── context/       # Global State (Theme, Authentication)
│   ├── pages/         # Full page views (Tasks, Habits, Login)
│   ├── api/           # Axios configuration
│   ├── App.jsx        # Main Router setup
│   └── main.jsx       # Entry point
├── server/
│   ├── models/        # Database Schemas (User, Task, Habit)
│   ├── routes/        # API Endpoints
│   ├── controllers/   # Business Logic
│   └── server.js      # Backend entry point
└── README.md
```

## 🛡️ License

This project is created for educational purposes.