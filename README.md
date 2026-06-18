# CareerVerse

CareerVerse is a full-stack project with a FastAPI backend and a React + Vite frontend.

## Project Structure

```text
careerverse/
backend/     FastAPI backend API
frontend/    React + Vite frontend
README.md    Project setup and GitHub process
```

## Required Software

Install these before running the project:

```text
Python 3.11 or newer
Node.js and npm
MongoDB connection string
Git
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment.

On Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `backend/.env` file and add the required environment variables:

```env
MONGODB_URL=your_mongodb_connection_string
MONGODB_DB_NAME=careerverse
JWT_SECRET_KEY=change_this_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Optional variables for AI and email features:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USERNAME=your_email_username
SMTP_PASSWORD=your_email_password
EMAIL_FROM=your_sender_email
```

Do not push the `.env` file to GitHub because it contains private keys and passwords.

Run the backend server:

```bash
uvicorn app.main:app --reload
```

The backend runs at:

```text
http://localhost:8000
```

You can check the API in the browser:

```text
http://localhost:8000/docs
```

## Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

The frontend is already configured to call the backend at:

```text
http://localhost:8000
```

Make sure the backend is running before using features like login, project generation, and resume analysis.

## Useful Commands

Run backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Run frontend:

```bash
cd frontend
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

Check frontend linting:

```bash
cd frontend
npm run lint
```

## How to Push This Project to GitHub

Use these steps when you want to push the full project to the GitHub repository it was cloned from.

### 1. Check the Current Repository

```bash
git remote -v
```

This shows the GitHub repository connected to the project.

```bash
git branch
```

This shows the branch you are currently working on. In this project, the main branch is usually `main`.

### 2. Check All Changed Files

```bash
git status
```

Review the list carefully before adding files.

Do not push private or generated files such as:

```text
.env
backend/.env
__pycache__/
*.pyc
.venv/
node_modules/
```

### 3. Add the Full Project

```bash
git add .
```

After adding files, check again:

```bash
git status
```

Make sure secret files like `.env` are not included.

### 4. Commit the Changes

```bash
git commit -m "Update CareerVerse project"
```

You can change the commit message to describe what you changed.

Example:

```bash
git commit -m "Add resume analysis feature"
```

### 5. Push to GitHub

```bash
git push origin main
```

This pushes your local changes to the `main` branch on GitHub.

### 6. If Push Permission Is Denied

If GitHub shows a permission error, ask the repository owner to add you as a collaborator.

The owner can do this from:

```text
GitHub repository > Settings > Collaborators > Add people
```

After you are added as a collaborator, run:

```bash
git push origin main
```

### 7. Safer Team Workflow

For team projects, it is safer to push changes to a new branch and create a pull request.

```bash
git checkout -b feature-update
git add .
git commit -m "Update CareerVerse project"
git push origin feature-update
```

Then open GitHub and create a pull request from `feature-update` into `main`.
