# ATHM - Student & Teacher Collaboration Platform

**ATHM** is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to streamline academic management by connecting teachers and students. Teachers can create virtual classrooms and post assignments, while students can join classes, track their homework, and manage personal tasks in one unified dashboard.

---

## 🚀 Key Features

### 👨‍🏫 For Teachers
* **Create Classrooms:** Easily create new classes with a name and subject.
* **Generate Class Codes:** Auto-generated unique 6-character codes for students to join.
* **Manage Students:** View enrolled students and remove them if necessary.
* **Post Assignments:** Create assignments with descriptions, due dates, and priority levels.
* **Track Progress:** See how many students have turned in assignments.
* **Delete Classroom:** Delete an entire classroom and all associated data.

### 👨‍🎓 For Students
* **Join Classrooms:** Enter a class code to instantly join a teacher's course.
* **Unified Task List:** View personal tasks and school assignments in one place.
* **Assignment Tracking:** Clearly see which class an assignment belongs to.
* **Leave Classroom:** Leave a class when the semester is over.
* **Task Management:** Create personal to-dos, mark them as complete, and filter by status (Pending, Overdue, Done).

### ⚙️ General Features
* **Secure Authentication:** JWT-based login and registration system.
* **Smart Filtering:** Filter tasks by "To-Do", "Overdue", or "Done".
* **Sorting:** Sort tasks by Priority (High/Medium/Low) or Due Date.
* **Subjects & Tagging:** Color-coded subjects to organize tasks visually.
* **Responsive Design:** Fully responsive UI built with Tailwind CSS.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js** (Vite)
* **Tailwind CSS** (Styling)
* **Lucide React** (Icons)
* **Axios** (API Requests)
* **React Hot Toast** (Notifications)
* **React Router DOM** (Navigation)

### **Backend**
* **Node.js** & **Express.js** (Server)
* **MongoDB** & **Mongoose** (Database)
* **JWT (JSON Web Tokens)** (Authentication)
* **Bcryptjs** (Password Hashing)
* **Dotenv** (Environment Variables)

---

## 📦 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ATHM.git](https://github.com/your-username/ATHM.git)
cd ATHM
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies.
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add the following:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.xyz.mongodb.net/ATHM_DB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```
*Note: Replace `MONGO_URI` with your actual MongoDB connection string.*

Start the server:
```bash
node server.js
```
*(The server should run on http://localhost:5000)*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies.
```bash
cd frontend
npm install
```

Start the React application:
```bash
npm run dev
```
*(The app should run on http://localhost:5173)*

---

## 📂 Project Structure

```
ATHM/
├── backend/
│   ├── config/         # Database connection logic
│   ├── controllers/    # Logic for User, Classroom, and Task operations
│   ├── middleware/     # Auth protection middleware
│   ├── models/         # Mongoose schemas (User, Classroom, Task, Subject)
│   ├── routes/         # API routes
│   ├── .env            # Environment variables (Sensitive info)
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/        # Axios configuration
    │   ├── components/ # Reusable UI components (Modals, Cards)
    │   ├── context/    # AuthContext for global state
    │   ├── pages/      # Main pages (Login, Dashboard, Classroom, Tasks)
    │   ├── App.jsx     # Main App component
    │   └── main.jsx    # DOM Entry point
    └── tailwind.config.js
```

---

## 🔗 API Endpoints

### **Users**
* `POST /api/users` - Register a new user
* `POST /api/users/login` - Login user
* `GET /api/users/me` - Get current user data

### **Classrooms**
* `GET /api/classrooms` - Get all joined/created classrooms
* `POST /api/classrooms` - Create a classroom (Teacher)
* `POST /api/classrooms/join` - Join a classroom (Student)
* `GET /api/classrooms/:id` - Get specific classroom details
* `DELETE /api/classrooms/:id` - Delete classroom (Teacher)
* `POST /api/classrooms/:id/leave` - Leave classroom (Student)

### **Tasks**
* `GET /api/tasks` - Get all tasks (Personal + Assignments)
* `POST /api/tasks` - Create a task
* `PUT /api/tasks/:id` - Update a task
* `DELETE /api/tasks/:id` - Delete a task
* `PATCH /api/tasks/:id/toggle` - Toggle completion status

---

## 🛡️ License

This project is open-source and available for educational purposes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request