# 🎯 InterviewAI – AI-Powered Interview Preparation Platform

A full-stack MERN application that generates personalized interview preparation reports using **Google Gemini AI**. Upload your resume (or describe your profile), paste a job description, and get a tailored strategy with technical & behavioral questions, skill gap analysis, and a 7-day study plan.

---

## ✨ Features

### 🔐 Authentication
- User registration & login with **JWT cookie-based auth**
- HTTP-only, same-site secure cookies for session management
- Token blacklisting on logout (MongoDB TTL index)
- Protected routes for authenticated users
- **Profile avatar** showing the first letter of the username with a dropdown (logout)

### 🤖 AI-Powered Interview Reports
- Paste any **job description** + upload your **resume** (PDF/DOC) or write a **self-description**
- **Google Gemini 2.5 Flash** generates a structured report with:
  - **Technical questions** (with intention & model answer)
  - **Behavioral questions** (STAR method based)
  - **Match score** (0–100%)
  - **Skill gaps** identified (severity: low/medium/high)
  - **7-day preparation plan**
- **ATS-optimized PDF resume generation** (via Puppeteer)
- Reports are saved and accessible from the dashboard

### 🎨 Modern UI
- Dark theme with gradient accents
- Drag-and-drop file upload
- Responsive design
- Real-time HMR (Vite) for development

---

## 🧱 Tech Stack

| Layer       | Technology                                                   |
|-------------|--------------------------------------------------------------|
| **Frontend**  | React 19, React Router 7, Vite 8, Sass, Axios               |
| **Backend**   | Node.js, Express 5, Mongoose 9, JWT, bcryptjs               |
| **Database**  | MongoDB Atlas (M0 Free Tier)                                  |
| **AI**        | Google Gemini API (`@google/genai`) with structured JSON output |
| **PDF**       | Puppeteer (HTML → A4 PDF)                                    |
| **Validation**| Zod, Zod-to-JSON-Schema                                      |

---

## 📁 Project Structure

```
📦 interview-ai
├── Backend
│   ├── server.js              # Entry point
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── src
│       ├── app.js             # Express app + middleware
│       ├── config/db.js       # MongoDB connection
│       ├── models/            # Mongoose schemas
│       │   ├── users.model.js
│       │   ├── interviewReport.model.js
│       │   └── blacklist.model.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── file.middleware.js
│       └── services/
│           ├── ai.service.js      # Gemini AI + Puppeteer
│           └── temp.js
│
└── Frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src
        ├── main.jsx
        ├── App.jsx
        ├── app.routes.jsx
        ├── style.scss
        ├── components/
        ├── features/
        │   ├── auth/
        │   │   ├── auth.context.jsx
        │   │   ├── auth.form.scss
        │   │   ├── hooks/useAuth.js
        │   │   ├── services/auth.api.jsx
        │   │   ├── pages/
        │   │   │   ├── login.jsx
        │   │   │   └── Register.jsx
        │   │   └── components/
        │   │       ├── Protected.jsx
        │   │       ├── ProfileAvatar.jsx
        │   │       └── ProfileAvatar.scss
        │   └── interview/
        │       ├── interview.context.jsx
        │       ├── hooks/useInterview.js
        │       ├── services/interview.api.js
        │       ├── style/
        │       │   ├── home.scss
        │       │   └── interview.scss
        │       └── pages/
        │           ├── Home.jsx
        │           └── interview.jsx
        └── style/
            └── button.scss
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas URI)
- **Google Gemini API key** ([Get yours here](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/Praggie29/Interview-AI.git
cd Interview-AI

# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in `Backend/`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/interview-master
JWT_SECRET=<your-random-secret-key>
GOOGLE_GENAI_API_KEY=<your-gemini-api-key>
```

### 3. Run the App

```bash
# Terminal 1 – Backend (port 3000)
cd Backend
node server.js
# or: npm run dev (requires nodemon)

# Terminal 2 – Frontend (port 5173)
cd Frontend
npm run dev
```

Open **http://localhost:5173** (or the port shown in the terminal).

---

## 🔌 API Endpoints

| Method | Endpoint               | Auth     | Description                     |
|--------|------------------------|----------|---------------------------------|
| POST   | `/api/auth/register`   | ❌       | Create account (username, email, password) |
| POST   | `/api/auth/login`      | ❌       | Login (email, password)          |
| GET    | `/api/auth/logout`     | ❌       | Logout (clears cookie + blacklists token) |
| GET    | `/api/auth/get-me`     | ✅ JWT   | Get current user details         |
| POST   | `/api/interview/generate` | ✅ JWT | Generate interview report (multipart) |
| GET    | `/api/interview/my-reports` | ✅ JWT | Get all reports for user       |
| GET    | `/api/interview/report/:id` | ✅ JWT | Get single report by ID        |

---

## 🗂️ Database Models

### User
```js
{
  name: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required)
}
```

### Interview Report
```js
{
  userId: ObjectId (ref: User),
  title: String,
  matchScore: Number,
  jobDescription: String,
  selfDescription: String,
  resumeFile: { data: Buffer, contentType: String },
  report: {
    technicalQuestions: [{ question, intention, answer }],
    behavioralQuestions: [{ question, intention, answer }],
    skillGaps: [{ skill, severity }],
    preparationPlan: [{ day, focus, tasks }]
  },
  status: String (enum: pending/completed/failed),
  createdAt, updatedAt: Date
}
```

### Token Blacklist
```js
{
  token: String,
  createdAt: Date (TTL index – auto-deletes after 24h)
}
```

---

## 🔒 Security

- **Passwords** hashed with bcryptjs (10 rounds)
- **JWT tokens** stored in HTTP-only cookies (prevents XSS)
- **SameSite: lax** for CSRF protection
- **Token blacklist** with TTL index auto-cleanup
- **CORS** restricted to frontend origins
- **File upload** size limited to 5MB, restricted types (PDF/DOC)

---

## 🧪 Testing the API

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

---

## 📸 Screenshots

*Add screenshots here – for example:*
- **Register/Login page** with error messages
- **Home page** with navbar + profile avatar
- **Interview report** showing questions, skill gaps, study plan

---

## 🛠️ Future Enhancements

- [ ] Email verification on registration
- [ ] OAuth (Google/GitHub login)
- [ ] Save multiple resumes per user
- [ ] Interview mock mode with voice-to-text
- [ ] Resume ATS score analysis
- [ ] Dark/light theme toggle
- [ ] Pagination for reports list

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) – AI report generation
- [Puppeteer](https://pptr.dev/) – PDF generation
- [React Router](https://reactrouter.com/) – Client-side routing
- [Vite](https://vitejs.dev/) – Frontend build tool
- [MongoDB Atlas](https://www.mongodb.com/atlas) – Cloud database

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Praggie29">Praggie29</a>
</p>