# Koupreng Invitation Project Requirements

This guide explains what team members need after cloning the project and how to reinstall files that are not pushed to GitHub because of `.gitignore`.

## What Is Not Pushed To GitHub

The project ignores generated and local-only files:

| Ignored path | Why it is ignored | How to recreate it |
| --- | --- | --- |
| `backend/target/` | Java build output | Run Maven commands in `backend/` |
| `frontend/node_modules/` | npm packages | Run `npm install` in `frontend/` |
| `frontend/dist/` | frontend build output | Run `npm run build` in `frontend/` |
| `service/venv/` | Python virtual environment | Run `python -m venv venv` and `pip install -r requirements.txt` in `service/` |
| `service/__pycache__/` | Python cache files | Created automatically by Python |
| `.env` files | local secrets/config | Copy from `.env.example` and edit locally |

These files should not be committed. They are recreated from committed files like `backend/pom.xml`, `frontend/package-lock.json`, root `requirements.txt`, `service/requirements.txt`, and `.env.example`.

## Quick Setup After Clone

Clone the repository:

```powershell
git clone https://github.com/KoeurngVireakk/Koupreng-invitation_project.git
cd Koupreng-invitation_project
```

Run the setup script:

```powershell
.\setup.ps1
```

This recreates the local files ignored by Git, including `frontend/node_modules/` and `service/venv/`. It also downloads backend Maven dependencies.
If `.env` does not exist, the script copies `.env.example` to `.env`.

If PowerShell blocks the script, run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then run `.\setup.ps1` again.

If the script says `JAVA_HOME must point to JDK 25`, run:

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-25"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\setup.ps1
```

To install only part of the project:

```powershell
.\setup.ps1 -SkipBackend
.\setup.ps1 -SkipFrontend
.\setup.ps1 -SkipService
```

## Required Tools

Install these before running `setup.ps1`:

| Tool | Required version |
| --- | --- |
| Java JDK | 25 |
| Node.js | 20.19+, 22.12+, or 24.15+ |
| npm | Installed with Node.js |
| Python | 3.11+ |
| MySQL Server | 8.0+ recommended |
| Git | Latest stable |
| Postman | Latest stable |

Check versions:

```powershell
java -version
javac -version
node -v
npm -v
python --version
git --version
mysql --version
```

The backend Maven wrapper is already included, so team members do not need to install Maven separately.

## Java 25 Check

The backend uses Java 25. Maven must also use Java 25.

From the project root:

```powershell
cd backend
.\mvnw.cmd -v
cd ..
```

If Maven shows Java 21 or another older version, set `JAVA_HOME` to JDK 25:

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-25"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

## MySQL Setup

Create the local database:

```sql
CREATE DATABASE IF NOT EXISTS koupreng_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

The backend currently uses:

```properties
DB_URL=jdbc:mysql://localhost:3306/koupreng_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Phnom_Penh&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=change_me
```

These values live in local `.env`, which is ignored by Git. If your local MySQL username or password is different, edit `.env`.

## Run The Project

Open separate terminals.

Backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm run dev
```

FastAPI service:

```powershell
cd service
.\venv\Scripts\Activate.ps1
uvicorn service:app --reload --port 8000
```

Local URLs:

```text
Backend: http://localhost:8080
Frontend: http://localhost:5173
FastAPI: http://localhost:8000
FastAPI health: http://localhost:8000/health
```

## Manual Install Commands

If you do not want to use `setup.ps1`, run these manually.

Backend dependencies:

```powershell
cd backend
.\mvnw.cmd dependency:go-offline
cd ..
```

Frontend dependencies:

```powershell
cd frontend
npm install
cd ..
```

FastAPI dependencies:

```powershell
cd service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

From the project root, you can also install the FastAPI dependencies with:

```powershell
python -m venv service\venv
.\service\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Useful Commands

Backend:

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd clean package
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
npm run preview
```

FastAPI:

```powershell
cd service
.\venv\Scripts\Activate.ps1
uvicorn service:app --reload --port 8000
```
