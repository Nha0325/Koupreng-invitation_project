📁 រចនាសម្ព័ន្ធ Project Frontend
🔌 api/

ប្រើសម្រាប់ ទាក់ទង Backend / Server

call API (fetch / axios)
example:
// api/userApi.js
export const getUsers = async () => {
  const res = await fetch("/api/users");
  return res.json();
};
🧩 components/

សម្រាប់ UI តូចៗដែលអាចប្រើឡើងវិញបាន

Button, Card, Navbar…
// components/Button.jsx
export default function Button({ text }) {
  return <button>{text}</button>;
}
🪝 hooks/

សម្រាប់ custom React hooks

logic ដែល reuse បាន
// hooks/useFetch.js
import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);

  return data;
}
📄 pages/

សម្រាប់ Page ទាំងអស់

Home, About, Login…
// pages/Home.jsx
export default function Home() {
  return <h1>Home Page</h1>;
}
🚦 routes/

សម្រាប់ កំណត់ Routing

connect page ទៅ URL
// routes/index.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
🧱 templates/

សម្រាប់ layout

Header / Footer / Sidebar
// templates/MainLayout.jsx
export default function MainLayout({ children }) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
    </div>
  );
}
🎨 themes/

សម្រាប់ style / design

colors, fonts, dark/light mode
// themes/theme.js
export const theme = {
  primary: "#3498db",
};
⚙️ utils/

សម្រាប់ function ជួយផ្សេងៗ

// utils/formatDate.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
✅ validators/

សម្រាប់ validate form

// validators/loginValidator.js
export const validateLogin = (data) => {
  if (!data.email) return "Email required";
  if (!data.password) return "Password required";
};
🔥 របៀបប្រើជាមួយគ្នា (Flow)
pages → call api
pages → use components
pages → wrap with templates
routes → connect pages
hooks → reuse logic
utils + validators → support logic
🧠 ឧទាហរណ៍ Flow ពិត

👉 Login Page:

pages/Login.jsx
ប្រើ components/Input
validate ដោយ validators
call API ក្នុង api/auth.js
ប្រើ useState ឬ hooks








                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>

                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>