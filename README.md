# Job Application Tracker 🎯

A full-stack AI-powered web application to help students track 
co-op job applications, generate documents, and stay on top of 
deadlines — built specifically for the Algonquin College co-op hunt.

## 🌐 Live Demo
[View Live](https://job-application-tracker-nu-eight.vercel.app/login)

## ✨ Features

### 📋 Application Management
- Full CRUD for job applications
- Status tracking (Applied, Interview, Offer, Rejected)
- Deadline countdowns and interview scheduling
- PDF export of application data using `jsPDF`

### 🤖 AI-Powered Tools (Groq API — Llama 3.3 70B)
- Cold email generator
- Cover letter writer
- Resume summary tool
- Job search coach chatbot
- Company research tool

### 🔐 Authentication (AWS Cognito)
- Email/password sign-up with email verification
- Forgot password flow
- Google OAuth via Cognito identity federation
- Per-user data isolation using `localStorage` with userId-scoped keys

### 🔔 Notifications & UX
- Browser push notifications for deadlines, interviews, follow-ups
- User-configurable notification preferences
- Dark mode with OS preference detection and manual toggle
- Contact form with real email sending via `EmailJS`

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Auth | AWS Cognito, Google OAuth |
| AI | Groq API (Llama 3.3 70B) |
| Notifications | Browser Push API |
| Email | EmailJS |
| PDF | jsPDF, jspdf-autotable |
| Deployment | Vercel |

## 🚀 Getting Started
```bash
git clone https://github.com/dhruvimadlani29/job-application-tracker.git
cd job-application-tracker
npm install
npm run dev
```

Create a `.env` file with:
```
VITE_COGNITO_USER_POOL_ID=your_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id
VITE_GROQ_API_KEY=your_groq_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📁 Project Structure
```
src/
├── components/       # Reusable UI components
├── pages/            # Route-level pages
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
└── styles/           # Tailwind config
```

## 👩‍💻 Author
**Dhruvi Madlani** — [LinkedIn](https://linkedin.com/in/dhruvi-madlani) 
| [GitHub](https://github.com/dhruvimadlani29)
