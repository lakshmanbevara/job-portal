<<<<<<< HEAD
# CST_11 – Job and Internship Portal for Students

A modern, responsive full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to facilitate placements, internships, and job matching workflows for university students.

---

## Key Features

### 👤 Role-Based Portals & Dashboards

1. **Student Dashboard:**
   - Create and update profiles containing education history (school, degree, GPA), work experiences, and key skills.
   - Upload and download resume files (PDF/DOCX) using Multer.
   - Search, filter, and apply for approved jobs and internships.
   - Track application stages (`Pending`, `Shortlisted`, `Selected`, `Rejected`) and withdraw applications at will.

2. **Company Dashboard:**
   - Manage and update company profile information (industry, headquarters location, website link, HR contact email).
   - Post, edit, and delete job and internship opportunities (listings start in a "Pending" stage until Admin approval).
   - Inspect applicant sheets: view candidate profiles, download resumes, and update application status.

3. **Admin Dashboard:**
   - Unified analytics summary displaying counts of students, companies, total jobs, and applications.
   - Manage student and company listings with permanent moderation/deletion.
   - Review pending job postings and toggle approval status to make listings visible to students.

---

## Technology Stack

- **Frontend:** React.js (Vite configuration) + Tailwind CSS (Aesthetic glassmorphic styling) + Axios
- **Backend:** Node.js + Express.js + Multer (File uploads)
- **Database:** MongoDB + Mongoose (Unified reference models)
- **Security:** JSON Web Tokens (JWT) + bcryptjs password hashing
=======
# StudentJobPortal - Job Portal for Students

StudentJobPortal is a complete professional MERN stack application designed exclusively for university students to search, bookmark, and apply for internships and entry-level positions. Companies can verify their profiles, post job openings, track candidates, and direct-message student applicants. System administrators have full analytics and verification controls.

The application features a premium UI theme with custom glassmorphism components, responsive dashboard panels, automated email alert simulations, and visual analytics charts.

---

## Technical Stack

- **Frontend**: React (Vite-powered), Tailwind CSS v4, Material UI (MUI), Framer Motion, Chart.js (via react-chartjs-2), React Icons, React Toastify.
- **Backend**: Node.js, Express.js, JWT Authentication (secure cookies), Bcrypt, Multer (local file storage uploads), Nodemailer, MongoDB, Mongoose.
- **Development Tools**: Concurrently (run both client & server using a single command).
>>>>>>> abc9896c6bdaa8df37f2e0488dff6168e93f4135

---

## Project Structure

```
<<<<<<< HEAD
job-portal/ (root)
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic handlers (Auth, Profile, Jobs, Admin)
│   ├── middleware/      # JWT auth guard, Multer file filters
│   ├── models/          # MongoDB schemas (User, Student, Company, Job, Application)
│   ├── routes/          # REST route declarations
│   ├── scripts/         # DB seed script
│   ├── uploads/         # Destination folder for uploaded student resumes
│   ├── .env             # Server configurations
│   └── server.js        # Main entry script
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/  # Navbars, footers, protected paths, cards
    │   ├── context/     # Auth global state provider
    │   ├── pages/       # Home, Login, Signup, Job search, dashboards, profile forms
    │   ├── services/    # Axios instance with auto JWT interceptors
    │   ├── App.jsx      # Navigation routers
    │   └── index.css    # Tailwind declarations and custom glass CSS
    └── package.json
=======
StudentJobPortal
├── client               # Frontend React Application (Vite + Tailwind v4)
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components   # Reusable UI elements (Navbar, Footer, Cards, Sidebar)
│   │   ├── context      # Authentication & Dark Mode Theme states
│   │   ├── pages        # Dashboards (Student, Company, Admin) & Home/Auth Views
│   │   ├── services     # API Axios client configuration
│   │   ├── index.css    # Tailwind CSS v4 main stylesheet
│   │   └── App.jsx      # Navigation routers
│   └── package.json
│
├── server               # Backend Node/Express API Server
│   ├── config           # MongoDB database & Cloudinary connectors
│   ├── controllers      # Database business logic routers handlers
│   ├── middleware       # Auth, Upload (Multer) & Global Error controllers
│   ├── models           # Mongoose schemas (User, Student, Company, Job, Review)
│   ├── routes           # Express route bindings
│   ├── uploads          # Local disk storage folder for PDFs and images
│   ├── utils            # Mailer & Database Seeder scripts
│   └── package.json
│
├── package.json         # Workspace concurrently start scripts
└── README.md
>>>>>>> abc9896c6bdaa8df37f2e0488dff6168e93f4135
```

---

<<<<<<< HEAD
## Installation & Running Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running on default port `27017`

### Step 1: Clone and Set Up Environment
Ensure your environment file `backend/.env` is configured correctly:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job_portal
JWT_SECRET=super_secret_key_cst_11_student_portal
NODE_ENV=development
```

### Step 2: Install Backend Dependencies & Seed Database
```bash
cd backend
npm install
npm run seed
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Run the Application (Both in One Command)
Run both the frontend and backend servers concurrently from the root directory:
```bash
npm run dev
```
This starts both the API server (port `5000`) and the React client (port `5173`) simultaneously.

*Or, you can run them individually:*

**Start Backend server:**
```bash
cd backend
npm run dev
```

**Start Frontend server:**
```bash
cd frontend
npm run dev
```

The React portal will spin up, running on `http://localhost:5173`.

---

## Test Accounts (Pre-seeded)

Use these accounts to explore role-specific functionalities immediately after seeding:

| User Role | Email / Roll Number | Password | Purpose |
|---|---|---|---|
| **Admin** | `admin@portal.com` | `adminpassword` | Oversee stats, approve pending jobs, moderate accounts |
| **Student (Rahul)** | `rahul@portal.com` or `CS2301` | `studentpassword` | Apply for jobs, upload resume, track status |
| **Student (Priya)** | `priya@portal.com` or `IT2302` | `studentpassword` | View postings, add education details |
| **Company** | `techcorp@portal.com` | `companypassword` | Post jobs, download student resumes, review candidates |
| **Company** | `innovatelabs@portal.com` | `companypassword` | Post design jobs (initially pending approval) |
=======
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher is recommended)
- [MongoDB](https://www.mongodb.com/) (Ensure MongoDB service is running locally on `mongodb://127.0.0.1:27017/studentjobportal`)

### Step 1: Install Dependencies
Run the installation command from the **root workspace directory** (`E:\project`):
```bash
npm run install-all
```
This script will automatically trigger package installations in the root directory, inside `/server` and inside `/client`.

### Step 2: Configure Environment Variables
A configured `.env` file has been pre-created under the `server` directory (`server/.env`):
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/studentjobportal
JWT_SECRET=supersecretjwtkeyforlocaldevelopment12345!@#
JWT_EXPIRE=30d
FROM_NAME=StudentJobPortal
FROM_EMAIL=noreply@studentjobportal.com
```
If you wish to configure SMTP email notification alerts or Cloudinary media upload integrations, you can add credentials as specified in `server/.env.example`.

### Step 3: Seed Database Data
Populate the database collections with pre-configured mock users (Admin, Companies, Students) and active job listings:
```bash
npm run seed
```
This runs `server/utils/seeder.js` and creates sample collections in MongoDB.

### Step 4: Run the Application
Launch both the Express API backend and Vite React frontend concurrently:
```bash
npm start
```
- **React Frontend**: Runs on [http://localhost:3000](http://localhost:3000) (requests proxy to server automatically).
- **Express Backend API**: Runs on [http://localhost:5000](http://localhost:5000).

---

## Mock Account Credentials (For Testing)

We have seeded default accounts with password `password123` so you can sign in and test dashboards instantly:

1. **System Administrator Account**:
   - Email: `admin@jobportal.com`
   - Password: `password123`
   - Accesses: Analytics charts, Company verifications, Moderation views.

2. **Company Accounts (Recruiter)**:
   - Email: `google@company.com` (Company: *Google*)
   - Email: `netflix@company.com` (Company: *Netflix*)
   - Password: `password123`
   - Accesses: Posting openings, Managing job status, Candidate tracking, Interview Scheduling, DMs.

3. **Student Accounts (Applicant)**:
   - Email: `student@student.com` (Student: *Alex Johnson* - has uploaded resume PDF)
   - Email: `johndoe@student.com` (Student: *Emma Watson* - empty resume profile)
   - Password: `password123`
   - Accesses: Profile editor, PDF Resume uploader, Skills manager, Job search filters, Applying, Bookmark tracking, DMs.
>>>>>>> abc9896c6bdaa8df37f2e0488dff6168e93f4135
