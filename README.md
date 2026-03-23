# Learning Hub: Teammate Onboarding Guide

Welcome to the **PM/Mentor Learning Management System** project! This guide will get you set up locally so you can start contributing to the React Frontend, FastAPI Backend, and Supabase Database.

---

## 🚀 1. Clone the Codebase
First, grab the latest code from GitHub and move into the project folder.

```bash
git clone https://github.com/ankitaingalagi/learning-hub.git
cd learning-hub
```

---

## 🗄️ 2. Supabase (Database Setup)
We use Supabase for our PostgreSQL database, Auth, and Storage.

**Option A: Link to the Cloud Database (Quickest for frontend/backend work)**
1. Ensure the Supabase CLI is installed globally: `npm install -g supabase`
2. Log into Supabase (if prompted): `npx supabase login`
3. Link the remote project securely: `npx supabase link --project-ref qnezxpkmrosbpchmttlw`
4. *(Optional)* Pull the latest schema if it changed: `npx supabase db pull`

**Option B: Run a Local Database (Recommended for disruptive DB schema testing)**
1. Ensure Docker is installed and running on your machine.
2. Run `npx supabase start` in the root folder.
3. This spins up a local Docker container mimicking our production database perfectly!
4. To apply your local database edits to the cloud later, run: `npx supabase db push`

*Note: All 22 database tables and relationships are strictly documented in the `DB_SCHEMA.md` file.*

---

## 🎨 3. Frontend Setup (React + Vite)
The front-end user interface is located exclusively within the `frontend` folder.

1. Move into the frontend directory: `cd frontend`
2. Install the necessary node packages: `npm install`
3. Start the Vite development server: `npm run dev`
4. Visit `http://localhost:5173` to view the beautiful dark-mode React application!

---

## ⚙️ 4. Backend Setup (Python FastAPI)
The back-end API is located entirely in the `backend` folder and manages critical business logic, security layers, and API Routes.

1. Move into the backend directory: `cd backend`
2. Create your `.env` file! Ask Ankita for the keys or copy them from the Supabase dashboard Settings -> API:
   ```env
   SUPABASE_URL=your_remote_or_local_supabase_url
   SUPABASE_ANON_KEY=your_remote_or_local_anon_key
   ```
3. Set up a pristine virtual environment (highly recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
4. Install all Python dependencies: `pip install -r requirements.txt`
5. Run the blazing-fast Uvicorn server: `uvicorn main:app --reload`
6. View the automatic API swagger documentation at `http://127.0.0.1:8000/docs`.

---

## 🛠️ 5. Contributing Workflow
When you want to build a new feature or fix a bug along with the team:

1. **Pull the latest code**: `git pull origin main`
2. **Create a new branch**: `git checkout -b feature/your-awesome-feature`
3. **Make your code enhancements** in the `frontend/` or `backend/`!
4. **Test Everything** via `npm run dev` and `uvicorn main:app --reload`.
5. **Push your branch**: 
   ```bash
   git add .
   git commit -m "feat: built awesome new feature"
   git push origin feature/your-awesome-feature
   ```
6. **Open a Pull Request** on GitHub for the team to review!
7. *(Important)*: If you modify the Supabase schema directly via the Dashboard, always run `npx supabase db pull` and commit the resulting migration SQL file into the `supabase/migrations/` folder so the rest of the team receives your database updates automatically!

---
*Happy Shipping! Built with React, FastAPI, and Supabase.*
