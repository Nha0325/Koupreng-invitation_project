# 📘 មេរៀនទី ១១ - React Router v7

## 🎯 គោលដៅមេរៀន
- Setup React Router
- ប្រើ BrowserRouter, Routes, Route
- ប្រើ Link និង NavLink
- ប្រើ useNavigate, useParams
- បង្កើត Protected Routes
- បង្កើត Multi-page App

---

## 1. ហេតុអ្វីត្រូវការ Router?

React គឺ **Single Page Application (SPA)**។ Router ជួយឱ្យ៖
- មានទំព័រច្រើន (`/home`, `/about`, `/contact`)
- ផ្លាស់ប្តូរទំព័រដោយមិន reload
- ទំនាក់ទំនងជាមួយ browser history
- Bookmark URLs បាន

---

## 2. Installation

```bash
npm install react-router-dom
```

---

## 3. Setup ដំបូង

### ឯកសារ main.jsx
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### ឯកសារ App.jsx
```jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <div>
      {/* Navigation */}
      <nav style={{ padding: '10px', backgroundColor: '#333' }}>
        <Link to="/" style={{ color: 'white', margin: '0 10px' }}>Home</Link>
        <Link to="/about" style={{ color: 'white', margin: '0 10px' }}>About</Link>
        <Link to="/contact" style={{ color: 'white', margin: '0 10px' }}>Contact</Link>
      </nav>
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export default App;
```

---

## 4. Pages

```jsx
// pages/Home.jsx
function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🏠 Home Page</h1>
      <p>សូមស្វាគមន៍មកកាន់គេហទំព័ររបស់យើង!</p>
    </div>
  );
}

// pages/About.jsx
function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>ℹ️ About</h1>
      <p>យើងគឺជាក្រុម Developer</p>
    </div>
  );
}

// pages/Contact.jsx
function Contact() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>📞 Contact</h1>
      <p>📧 hello@example.com</p>
    </div>
  );
}
```

---

## 5. Link vs NavLink

### Link (សាមញ្ញ)
```jsx
<Link to="/about">About</Link>
```

### NavLink (សកម្ម state)
```jsx
import { NavLink } from 'react-router-dom';

<NavLink 
  to="/about"
  style={({ isActive }) => ({
    color: isActive ? 'red' : 'black',
    fontWeight: isActive ? 'bold' : 'normal'
  })}
>
  About
</NavLink>
```

### ឬប្រើ className
```jsx
<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? "active-link" : ""}
>
  About
</NavLink>
```

---

## 6. Dynamic Routes (URL Params)

```jsx
// App.jsx
<Route path="/users/:id" element={<UserDetail />} />
<Route path="/products/:category/:id" element={<Product />} />
```

```jsx
// UserDetail.jsx
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>User #{id}</h1>
      <p>បង្ហាញព័ត៌មាន user លេខ {id}</p>
    </div>
  );
}
```

```jsx
// ប្រើ
<Link to="/users/1">User 1</Link>
<Link to="/users/2">User 2</Link>
<Link to="/users/3">User 3</Link>
```

---

## 7. useNavigate (Programmatic Navigation)

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  function handleLogin(e) {
    e.preventDefault();
    
    // Login logic...
    
    // ផ្លាស់ប្តូរទំព័រ
    navigate('/dashboard');
    
    // ឬ navigate ទៅទំព័រមុន
    // navigate(-1);
    
    // ឬ replace (មិនបន្ថែម history)
    // navigate('/dashboard', { replace: true });
  }
  
  return (
    <form onSubmit={handleLogin}>
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 8. Query Strings

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'name';
  
  return (
    <div>
      <h1>Products</h1>
      <p>Category: {category}</p>
      <p>Sort: {sort}</p>
      
      <button onClick={() => setSearchParams({ category: 'food', sort: 'price' })}>
        Filter Food
      </button>
    </div>
  );
}

// URL: /products?category=food&sort=price
```

---

## 9. Nested Routes

```jsx
// App.jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

```jsx
// DashboardLayout.jsx
import { Outlet, Link } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', padding: '10px', backgroundColor: '#eee' }}>
        <h3>Dashboard</h3>
        <Link to="/dashboard">Home</Link><br/>
        <Link to="/dashboard/profile">Profile</Link><br/>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>
      
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />  {/* 🎯 Child routes render at នេះ */}
      </main>
    </div>
  );
}
```

---

## 10. Protected Routes

```jsx
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

---

## 11. ឧទាហរណ៍ Multi-Page App ពេញលេញ

### ឯកសារ App.jsx
```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

### Layout.jsx
```jsx
import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
  const navStyle = ({ isActive }) => ({
    color: isActive ? '#ff6b6b' : '#fff',
    margin: '0 15px',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal'
  });
  
  return (
    <div>
      <header style={{ backgroundColor: '#222', padding: '15px' }}>
        <NavLink to="/" style={navStyle} end>🏠 Home</NavLink>
        <NavLink to="/products" style={navStyle}>🛍️ Products</NavLink>
        <NavLink to="/about" style={navStyle}>ℹ️ About</NavLink>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer style={{ backgroundColor: '#eee', padding: '15px', textAlign: 'center' }}>
        © 2026 My App
      </footer>
    </div>
  );
}
```

### Products.jsx
```jsx
import { Link } from 'react-router-dom';

function Products() {
  const products = [
    { id: 1, name: "ទូរស័ព្ទ", price: 500 },
    { id: 2, name: "កុំព្យូទ័រ", price: 1200 },
    { id: 3, name: "កាមេរ៉ា", price: 800 }
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>🛍️ Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link> - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### ProductDetail.jsx
```jsx
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const products = {
    "1": { name: "ទូរស័ព្ទ", price: 500, desc: "..." },
    "2": { name: "កុំព្យូទ័រ", price: 1200, desc: "..." },
    "3": { name: "កាមេរ៉ា", price: 800, desc: "..." }
  };
  
  const product = products[id];
  
  if (!product) return <p>Product not found</p>;
  
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)}>⬅️ Back</button>
      <h1>{product.name}</h1>
      <p>💰 ${product.price}</p>
      <p>{product.desc}</p>
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត 4-page website (Home, About, Services, Contact)
2. បង្កើត Blog ដែលមាន `/blog` និង `/blog/:slug`
3. បង្កើត Authentication flow ជាមួយ Protected Routes
4. បន្ថែម Search ដោយប្រើ query string
5. បង្កើត Dashboard ដែលមាន nested routes (3+ ទំព័រ)

---

## ✅ សង្ខេប

| Component/Hook | ការប្រើ |
|----------------|---------|
| `<BrowserRouter>` | រុំ App |
| `<Routes>` | Container of Routes |
| `<Route>` | កំណត់ path |
| `<Link>` | Navigation link |
| `<NavLink>` | Active link |
| `<Outlet>` | Render nested routes |
| `useParams()` | យក URL params |
| `useNavigate()` | Navigate ដោយ code |
| `useSearchParams()` | យក query strings |

➡️ **បន្ទាប់៖** [មេរៀនទី ១២ - useMemo & useCallback](./12-useMemo-useCallback.md)
