# Koupreng Invitation Project Requirements

This guide explains what team members need after cloning the project and how to reinstall files that are not pushed to GitHub because of `.gitignore`.

## What Is Not Pushed To GitHub

The project ignores generated and local-only files:

| Ignored path | Why it is ignored | How to recreate it |
| --- | --- | --- |
| `backend/target/` | Java build output | Run Maven commands in `backend/` |
| `frontend-user/node_modules/` | user UI npm packages | Run `npm install` in `frontend-user/` |
| `frontend-admin/node_modules/` | admin UI npm packages | Run `npm install` in `frontend-admin/` |
| `frontend-user/dist/` | user UI build output | Run `npm run build` in `frontend-user/` |
| `frontend-admin/dist/` | admin UI build output | Run `npm run build` in `frontend-admin/` |
| `service/venv/` | Python virtual environment | Run `python -m venv venv` and `pip install -r requirements.txt` in `service/` |
| `service/__pycache__/` | Python cache files | Created automatically by Python |
| `.env` files | local secrets/config | Copy from `.env.example` and edit locally |

These files should not be committed. They are recreated from committed files like `backend/pom.xml`, frontend `package-lock.json` files, root `requirements.txt`, `service/requirements.txt`, and `.env.example`.

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

On Windows, this now performs the full first-run setup:

- installs missing system tools with WinGet: JDK 25, Node.js LTS, Python 3.13, MySQL Server, Git, and Postman
- installs Apache Maven from the official Apache archive when `mvn` is missing
- recreates ignored local files such as frontend `node_modules/` folders and `service/venv/`
- downloads backend Maven dependencies
- creates `.env`, `frontend-user/.env`, and `frontend-admin/.env` from their templates when they do not exist
- asks for MySQL credentials only when `.env` still contains placeholder values, then creates the local database automatically

If you want to install project dependencies only and keep system tools manual, run:

```powershell
.\setup.ps1 -SkipToolInstall
```

If you want to skip automatic database creation:

```powershell
.\setup.ps1 -SkipDatabaseSetup
```

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

`setup.ps1` can install these automatically on Windows when they are missing:

| Tool | Required version |
| --- | --- |
| Java JDK | 25 |
| Node.js | 20.19+, 22.12+, or 24.15+ |
| npm | Installed with Node.js |
| Python | 3.11+ |
| MySQL Server | 8.0+ recommended |
| Git | Latest stable |
| Postman | Latest stable |
| Apache Maven | Latest stable |

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

The backend Maven wrapper is already included, so the project can run without global Maven, but the setup script also installs Apache Maven so the machine is fully prepared for Java work.

`setup.ps1` can install MySQL Server and create the database automatically. If `DB_USERNAME` or `DB_PASSWORD` still contains a placeholder value, the script asks for the local MySQL credentials and writes them into `.env` before creating the database.

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

`setup.ps1` creates the local database automatically with:

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

User frontend:

```powershell
cd frontend-user
npm run dev
```

The user frontend defaults to `VITE_API_URL=/api`; Vite proxies `/api` to the Spring Boot backend at `http://localhost:8080`. Run the FastAPI service only if you explicitly set `VITE_API_URL=http://localhost:8000/api`.

Admin frontend:

```powershell
cd frontend-admin
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
User frontend: http://localhost:5173
Admin frontend: http://localhost:5174
FastAPI: http://localhost:8000
FastAPI health: http://localhost:8000/health
```

## Google Login Setup

Create or select a Google OAuth client with Application type `Web application`. Add these Authorized JavaScript origins for local development:

```text
http://localhost
http://localhost:5173
```

Set the web client ID in local `.env`:

```properties
GOOGLE_CLIENT_IDS=your-google-web-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

`GOOGLE_CLIENT_IDS` is used by the backend to verify Google ID tokens. `VITE_GOOGLE_CLIENT_ID` is used by the user frontend; if it is omitted, `frontend-user/vite.config.js` falls back to the first value in `GOOGLE_CLIENT_IDS`.

## Telegram Login Setup

For local development, use Telegram's domain-based widget with a localhost alias. `localhost` itself is not accepted by BotFather `/setdomain`, so use `lvh.me`, which resolves to `127.0.0.1`.

1. Open `@BotFather`.
2. Choose your bot.
3. Use `Bot Settings > Domain` or `/setdomain`.
4. Send only the bare domain:

```text
lvh.me
```

Do not include `http://`, `:5173`, or `/login` in the domain command.

Open the local user frontend with:

```text
http://lvh.me:5173/login
```

For production or a public HTTPS tunnel, use the newer Web Login / OIDC setup and add the real HTTPS URLs, for example:

```text
https://koupreng.example.com
https://koupreng.example.com/login
```

Set these values in local `.env`:

```properties
TELEGRAM_BOT_TOKEN=123456789:your_bot_token
TELEGRAM_CLIENT_ID=
TELEGRAM_BOT_USERNAME=your_bot_username
VITE_TELEGRAM_CLIENT_ID=
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

Keep `TELEGRAM_CLIENT_ID` and `VITE_TELEGRAM_CLIENT_ID` blank for localhost. If you later use the newer Web Login / OIDC setup, fill both with the Client ID shown in BotFather Web Login.

Restart the backend and the Vite dev server after changing any auth value in `.env`.

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
cd frontend-user
npm install
cd ..
cd frontend-admin
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

User frontend:

```powershell
cd frontend-user
npm run lint
npm run build
npm run preview
```

Admin frontend:

```powershell
cd frontend-admin
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
