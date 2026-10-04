# InterviewAI

An AI-powered interview preparation platform that generates personalized interview reports, technical & behavioral questions, skill gap analysis, and tailored preparation roadmaps based on a candidate's resume and a target job description.

🌐 **Live Demo**: http://resume-interview-ai-qeyb-git-main-prag1.vercel.app

---

## 🚀 Features

- **Authentication:** Full JWT-based auth with register, login, logout, and session persistence via httpOnly cookies.
- **AI Interview Report Generation:** Submit a job description plus your resume (PDF) or a self-description to receive a structured interview preparation report.
- **Technical & Behavioral Questions:** AI generates realistic interview questions with the **intention** behind each question and a **model answer**.
- **Match Score:** A 0–100% compatibility score indicating how well your profile matches the job.
- **Skill Gap Analysis:** Identifies missing skills with severity levels (low / medium / high).
- **7-Day Preparation Plan:** A day-by-day study roadmap with specific tasks to help you prepare.
- **Resume PDF Download:** AI rewrites your resume tailored to the job description and generates a polished PDF for download.
- **Recent Reports Dashboard:** View and revisit all your past interview reports.
- **Protected Routes:** Unauthenticated users are redirected to the login page.
- **In-Memory Caching:** Frequently accessed data (AI reports, generated PDFs, and report queries) is cached to speed up responses and reduce AI API costs.

---

## 🧱 Tech Stack

### Backend

| Technology      | Purpose                            |
|-----------------|------------------------------------|
| Node.js         | Runtime environment                |
| Express.js      | Web framework & REST API           |
| MongoDB + Mongoose | Database & ODM                  |
| Google Gen AI (Gemini 2.5 Flash) | AI-powered report generation |
| JWT             | Authentication tokens              |
| bcryptjs        | Password hashing                   |
| Multer          | File upload handling               |
| Puppeteer       | PDF generation from HTML           |
| pdf-parse       | Extract text from uploaded PDFs    |
| Zod             | Schema validation for AI responses |
| node-cache      | In-memory caching for performance  |

### Frontend

| Technology      | Purpose                            |
|-----------------|------------------------------------|
| React 19        | UI framework                       |
| React Router 7  | Client-side routing                |
| Vite            | Build tool & dev server            |
| Axios           | HTTP client for API calls          |
| SCSS            | Styling (Sass with nested rules)   |

---

## 📁 Project Structure

```
├── Backend/
│   ├── server.js                    # Entry point, starts Express on port 3000
│   ├── src/
│   │   ├── app.js                   # Express app setup (CORS, cookies, routes)
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Register, login, logout, get-me
│   │   │   └── interview.controller.js # Generate report, get reports, download PDF
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   └── file.middleware.js    # Multer file upload config
│   │   ├── models/
│   │   │   ├── users.model.js       # User schema (name, email, password)
│   │   │   ├── interviewReport.model.js # Report schema (questions, gaps, plan)
│   │   │   └── blacklist.model.js   # Token blacklist for logout
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Auth API routes
│   │   │   └── interview.routes.js  # Interview API routes
│   │   └── services/
│   │       ├── ai.service.js        # Gemini AI integration + Puppeteer PDF
│   │       ├── cache.service.js     # In-memory caching wrapper (node-cache)
│   │       └── temp.js              # (placeholder)
│   ├── .env                         # Environment variables (JWT_SECRET, GOOGLE_GENAI_API_KEY, MONGO_URI)
│   └── package.json
│
├── Frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.jsx                  # Root component with providers
│   │   ├── app.routes.jsx           # Route definitions
│   │   ├── style.scss               # Global styles
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── auth.context.jsx      # Auth state (user, loading)
│   │   │   │   ├── auth.form.scss        # Login/Register styles
│   │   │   │   ├── hooks/useAuth.js      # Auth hook (login, register, logout)
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login.jsx         # Login page
│   │   │   │   │   └── Register.jsx      # Register page
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.api.jsx      # Auth API calls
│   │   │   │   └── components/
│   │   │   │       ├── ProfileAvatar.jsx # User avatar with dropdown
│   │   │   │       ├── ProfileAvatar.scss
│   │   │   │       └── Protected.jsx     # Route guard component
│   │   │   └── interview/
│   │   │       ├── interview.context.jsx # Interview state
│   │   │       ├── hooks/useInterview.js # Interview hook (generate, fetch, download)
│   │   │       ├── pages/
│   │   │       │   ├── Home.jsx          # Dashboard: form + recent reports
│   │   │       │   └── interview.jsx     # Report detail view with tabs
│   │   │       ├── services/
│   │   │       │   └── interview.api.js  # Interview API calls
│   │   │       └── style/
│   │   │           ├── home.scss
│   │   │           └── interview.scss
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Auth Required | Description                           |
|--------|-------------|---------------|---------------------------------------|
| POST   | `/register` | No            | Create account & set JWT cookie       |
| POST   | `/login`    | No            | Login & set JWT cookie                |
| GET    | `/logout`   | No            | Clear JWT cookie & blacklist token    |
| GET    | `/get-me`   | Yes           | Fetch current logged-in user details  |

### Interview Reports (`/api/interview`)

| Method | Endpoint                         | Auth Required | Description                              |
|--------|----------------------------------|---------------|------------------------------------------|
| POST   | `/`                              | Yes           | Generate a new interview report (multipart: resume PDF + jobDescription + selfDescription) |
| GET    | `/`                              | Yes           | Get all interview reports for the user   |
| GET    | `/report/:interviewId`           | Yes           | Get a single report by ID                |
| POST   | `/resume/pdf/:interviewReportId` | Yes           | Download an AI-generated resume PDF      |

---

## 🧠 How AI Report Generation Works

1. The user provides a **job description**, plus either a **resume PDF** or a **self-description** (or both).
2. The backend extracts text from the uploaded PDF using `pdf-parse`.
3. A structured prompt is sent to **Google Gemini 2.5 Flash** with a predefined JSON schema.
4. The AI returns:
   - `title` — job role extracted from the description
   - `matchScore` — 0–100 compatibility percentage
   - `technicalQuestions` — 5–8 questions (each with intention + model answer)
   - `behavioralQuestions` — 4–6 questions (each with intention + model answer)
   - `skillGaps` — missing skills with severity (low/medium/high)
   - `preparationPlan` — a 7-day roadmap with focus areas and tasks
5. The response is validated against the schema and saved to MongoDB.
6. Users can also request an **AI-rewritten resume PDF** tailored to the job description, generated via Puppeteer.

---

## ⚡ Caching

The backend uses **`node-cache`** — a lightweight in-memory cache — to improve performance and reduce costs. No external Redis/DB setup is required.

### What gets cached

| Data | Cache Key | TTL | Notes |
|------|-----------|-----|-------|
| AI interview report | `interviewReport:<input content>` | 1 hour | Identical inputs skip the Gemini API call entirely |
| AI-generated resume PDF | `resumePdf:<input content>` | 1 hour | Avoids re-running Gemini + Puppeteer |
| Single report by ID | `interviewReport:<userId>:<reportId>` | 10 min | Reports are immutable, so caching is safe |
| User's report list | `interviewReports:list:<userId>` | 5 min | Invalidated automatically when a new report is created |

### How it works

- The `cache.service.js` wrapper exposes `get`, `set`, `del`, `has`, and `getOrSet` helpers.
- `getOrSet(key, fallbackFn, ttl)` returns the cached value if present, otherwise computes it via `fallbackFn` and stores it.
- Cache keys are **deterministic** — built from the exact input content — so only identical requests hit the cache.
- When a new interview report is generated, the user's cached report list is **invalidated** so fresh data appears immediately.

### Benefits

- ⚡ **Faster responses** — repeated identical requests return instantly from memory.
- 💰 **Lower AI API costs** — Gemini calls are made only once per unique input within the TTL window.
- 🗄️ **Reduced database load** — frequently-read report queries hit memory instead of MongoDB.

> **Note:** This is in-memory caching, so the cache is per-server-instance and resets on restart. For horizontal scaling across multiple instances, swap the underlying implementation in `cache.service.js` for a shared cache like **Redis** (`ioredis`) — the rest of the codebase stays unchanged.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Google Gemini API Key** ([get one here](https://aistudio.google.com/apikey))

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Praggie29/Interview-AI.git
cd Interview-AI

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 3. Run the Application

1. Navigate to live link
2. **Register** a new account
3. Paste a **job description**, upload a **resume PDF** (or write a self-description)
4. Click **"Generate My Interview Strategy"**
5. View your personalized interview report with technical questions, behavioral questions, skill gaps, and a 7-day roadmap
6. Download a **tailored resume PDF** from the report page

---

## 🔐 Authentication Flow

1. User registers or logs in → backend creates a **JWT token** and sets it as an **httpOnly cookie**.
2. Protected API routes verify the token via `auth.middleware.js`.
3. On logout, the token is **blacklisted** in the database and the cookie is cleared.
4. The frontend checks session on mount via the `/get-me` endpoint; if invalid, the user is shown the login page.

---

## ✅ Linting & Build

```bash
# Frontend lint
cd Frontend
npm run lint

# Frontend production build
npm run build
