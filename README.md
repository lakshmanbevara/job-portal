# StudentJobPortal - Job Portal for Students

StudentJobPortal is a complete professional MERN stack application designed exclusively for university students to search, bookmark, and apply for internships and entry-level positions. Companies can verify their profiles, post job openings, track candidates, and direct-message student applicants. System administrators have full analytics and verification controls.

The application features a premium UI theme with custom glassmorphism components, responsive dashboard panels, automated email alert simulations, and visual analytics charts.

---

## Technical Stack

- **Frontend**: React (Vite-powered), Tailwind CSS v4, Material UI (MUI), Framer Motion, Chart.js (via react-chartjs-2), React Icons, React Toastify.
- **Backend**: Node.js, Express.js, JWT Authentication (secure cookies), Bcrypt, Multer (local file storage uploads), Nodemailer, MongoDB, Mongoose.
- **Development Tools**: Concurrently (run both client & server using a single command).

---

## Project Structure

```
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
```

---

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
