# Portfolio Project

This is a personal portfolio website with a built-in Admin Dashboard for managing projects and messages.

## Features
- **Dynamic Portfolio**: Projects are loaded from a JSON database.
- **Admin Dashboard**: secured interface (`/dashboard.html`) to add projects and view messages.
- **Contact Form**: Functional contact form.
- **Auto-Scraping**: Fetches project metadata (title, image) from URLs automatically.

## Setup

1. **Open Terminal**:
   Open Command Prompt or PowerShell.

2. **Go to Project Folder** (Crucial Step):
   ```bash
   cd c:\Users\ranje\.gemini\antigravity\scratch\portfolio_project
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Add Resume**:
   Place your PDF resume file in this folder and name it `cv.pdf`.

## Running the Server

Start the application with:
```bash
npm start
```
OR
```bash
node server.js
```

User Access:
- **Main Site**: `http://localhost:3000`
- **Dashboard**: `http://localhost:3000/dashboard.html`

## Credentials

- **Username**: `admin`
- **Password**: `admin123`

(You can change these in `server.js`)
