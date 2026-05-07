  git config --global user.email "nhastar0325@gmail.com"
  git config --global user.name "nhastar0325-boop"



# Full-Stack Application: Vite + React JSX Frontend, Spring Boot Java Backend, Python Services, Bakong Payment

This project demonstrates a complete full-stack web application with modern technologies.

## Tech Stack

### Frontend

- **Framework**: Vite + React
- **Language**: JavaScript with JSX
- **Styling**: Tailwind CSS
- **Location**: `Frontend/` directory

### Backend

- **Framework**: Spring Boot
- **Language**: Java 25
- **Database**: H2 (in-memory for development)
- **Location**: `Backend/` directory

### Python Services

- **Framework**: Flask
- **Purpose**: Utility services, data processing
- **Location**: `Python/` directory

### Payment Integration

- **Provider**: Bakong (Cambodian payment gateway)
- **Implementation**: REST API integration in Spring Boot

## Project Structure

```
myProject/
├── Frontend/          # Vite + React application
├── Backend/           # Spring Boot Java application
├── Python/            # Python Flask services
├── lession/           # React JSX learning materials
├── plan.md            # Project planning
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (for Frontend)
- Java 17 (for Backend)
- Python 3.8+ (for Python services)
- Maven (for Backend)

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd Backend
mvn spring-boot:run
```

### Python Setup

```bash
cd Python
pip install -r requirements.txt
python app.py
```

## API Endpoints

### Backend (Spring Boot - port 8080)

- `GET /api/hello` - Hello message
- `POST /api/payment/process?amount=100&currency=USD` - Process payment via Bakong

### Python (Flask - port 5001)

- `GET /api/python/hello` - Hello from Python service

## Learning Objectives

This project serves as a learning resource for:

- React JSX fundamentals and best practices
- Spring Boot REST API development
- Python integration in full-stack apps
- Payment gateway integration (Bakong)
- Full-stack application architecture

## Development Notes

- Frontend runs on port 5173 (Vite default)
- Backend runs on port 8080 (Spring Boot default)
- Python service runs on port 5001
- Use the `lession/lession.md` file for React JSX learning materials
- Refer to `copilot-instructions.md` for development guidelines


១. ផ្នែកសំខាន់ៗនៃ Component (React Component Structure) 🧱
នៅក្នុង React យើងអាចបែងចែក component នេះជា ៣ ផ្នែកធំៗ៖
Header: ផ្នែកខាងលើដែលមាន Logo និង Menu។
Pricing Section: ផ្នែកកណ្តាលដែលមានកាតចំនួន ៣ (Standard, Premier, Concierge)។
Background Layer: ផ្នែកខាងក្រោយដែលមានរូបភាពព្រាលៗ (blurred) និងពណ៌ gradient។
២. ការប្រើប្រាស់ពណ៌ (Color Codes) 🎨
ដើម្បីឱ្យពណ៌មើលទៅប្រណីតដូចក្នុងរូបភាព (Gold & Cream theme) អ្នកអាចប្រើលេខកូដពណ៌ (Hex Codes) ដូចខាងក្រោម៖
Gold (ពណ៌មាស): #D4AF37 ឬ #C5A059
Light Cream (ពណ៌ឡេ): #F9F4E8
Dark Purple (ពណ៌ស្វាយចាស់សម្រាប់ប៊ូតុង): #4B2C5E
White (ពណ៌ស): #FFFFFF
៣. របៀបស្វែងរក Background 🖼️
ដើម្បីទទួលបាន Background ដែលស្អាត និងស៊ីគ្នា អ្នកអាចសាកល្បងវិធីទាំងនេះ៖
CSS Gradient: អ្នកមិនចាំបាច់ប្រើរូបភាពទេ គឺប្រើ CSS ដើម្បីបង្កើតពណ៌ដេញ៖
background: linear-gradient(to bottom, #F9F4E8, #E6D5B8);
Stock Photos: ស្វែងរកពាក្យ "Luxury Wedding Hall Background" ឬ "Golden Floral Pattern" ក្នុងវេបសាយដូចជា Unsplash ឬ Pexels រួចប្រើ CSS filter: blur(5px); ដើម្បីឱ្យវាព្រាលដូចក្នុងរូប។
Patterns: ប្រសិនបើអ្នកចង់បានក្បាច់ខ្មែរតិចៗនៅផ្នែកខាងក្រោម អ្នកអាចរក "Khmer Traditional Pattern Vector"។

Frontend

npx @tailwindcss/cli -i ./src/assets/style/input.css -o ./src/assets/style/output.css --watch




API-Key
# API key removed for security — store secrets in environment variables, not in code