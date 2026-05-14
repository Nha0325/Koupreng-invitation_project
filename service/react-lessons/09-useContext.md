# 📘 មេរៀនទី ០៩ - useContext (Context API)

## 🎯 គោលដៅមេរៀន
- ស្គាល់បញ្ហា Props Drilling
- ប្រើ createContext និង useContext
- បង្កើត Dark Mode
- បង្កើត Auth Context

---

## 1. បញ្ហា Props Drilling

```jsx
// ❌ បញ្ចូន user តាមរយៈ component ច្រើនកម្រិត
function App() {
  const user = { name: "សុខា" };
  return <Page user={user} />;
}

function Page({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  return <Navbar user={user} />;
}

function Navbar({ user }) {
  return <p>សួស្តី, {user.name}</p>;
}
```

⚠️ Component កណ្តាល (Page, Header) មិនត្រូវការ `user` ប៉ុន្តែត្រូវបញ្ជូនបន្ត។

---

## 2. ដំណោះស្រាយ៖ Context API

```jsx
// ✅ ប្រើ Context
import { createContext, useContext } from 'react';

const UserContext = createContext();

function App() {
  const user = { name: "សុខា" };
  return (
    <UserContext.Provider value={user}>
      <Page />
    </UserContext.Provider>
  );
}

function Page() {
  return <Header />;
}

function Header() {
  return <Navbar />;
}

function Navbar() {
  const user = useContext(UserContext);  // 🎯 យកដោយផ្ទាល់!
  return <p>សួស្តី, {user.name}</p>;
}
```

---

## 3. ៣ ជំហាននៃ Context

### ជំហាន ១៖ បង្កើត Context
```jsx
import { createContext } from 'react';

const ThemeContext = createContext();
```

### ជំហាន ២៖ Provide Value
```jsx
<ThemeContext.Provider value={"dark"}>
  <App />
</ThemeContext.Provider>
```

### ជំហាន ៣៖ Consume Value
```jsx
const theme = useContext(ThemeContext);
```

---

## 4. Mini Project: Dark Mode

### ឯកសារ ThemeContext.jsx
```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => setIsDark(!isDark);
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
```

### ឯកសារ App.jsx
```jsx
import { ThemeProvider } from './ThemeContext';
import Layout from './Layout';

function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
```

### ឯកសារ Layout.jsx
```jsx
import { useTheme } from './ThemeContext';

function Layout() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: isDark ? '#222' : '#fff',
      color: isDark ? '#fff' : '#000',
      minHeight: '100vh',
      padding: '20px',
      transition: 'all 0.3s'
    }}>
      <h1>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</h1>
      <button onClick={toggleTheme}>
        ប្តូរទៅ {isDark ? 'Light' : 'Dark'}
      </button>
      
      <Article />
    </div>
  );
}

function Article() {
  const { isDark } = useTheme();
  
  return (
    <article style={{ 
      padding: '20px',
      border: `1px solid ${isDark ? '#444' : '#ddd'}` 
    }}>
      <h2>មាតិកា</h2>
      <p>ពណ៌ផ្ទៃខាងក្រោយផ្លាស់ប្តូរតាម theme</p>
    </article>
  );
}
```

---

## 5. Mini Project: Authentication Context

### ឯកសារ AuthContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user ពី localStorage ពេល mount
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);
  
  function login(email, password) {
    // ឧទាហរណ៍សាមញ្ញ - ជាក់ស្តែងគួរហៅ API
    const userData = { email, name: email.split('@')[0] };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  function logout() {
    setUser(null);
    localStorage.removeItem('user');
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### ឯកសារ App.jsx
```jsx
import { AuthProvider, useAuth } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>;
  
  return user ? <Dashboard /> : <Login />;
}

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>🔐 Login</h2>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="អ៊ីមែល"
        required
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="ពាក្យសម្ងាត់"
        required
      />
      <button type="submit">ចូលប្រើ</button>
    </form>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h2>👋 សួស្តី, {user.name}!</h2>
      <p>📧 {user.email}</p>
      <button onClick={logout}>Logout</button>
      
      <Profile />
    </div>
  );
}

function Profile() {
  const { user } = useAuth();  // 🎯 មិនត្រូវការ props!
  return <p>Profile of {user.name}</p>;
}
```

---

## 6. Multiple Contexts

```jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Main />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// ឬប្រើ wrapper component
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Main />
    </AppProviders>
  );
}
```

---

## 7. ⚠️ កំហុសធម្មតា

### កំហុស ១៖ ភ្លេច Provider
```jsx
// ❌ បើគ្មាន ThemeProvider, useTheme = undefined
function App() {
  return <Layout />;  // useTheme() throw error
}

// ✅
function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}
```

### កំហុស ២៖ Re-render មិនចាំបាច់

ប្រសិនបើ value ផ្លាស់ប្តូរ → គ្រប់ consumer នឹង rerender

```jsx
// ❌ object ថ្មីរាល់ render
<Context.Provider value={{ user, login, logout }}>

// ✅ ប្រើ useMemo
const value = useMemo(() => ({ user, login, logout }), [user]);
<Context.Provider value={value}>
```

---

## 8. ពេលណាគួរប្រើ Context?

✅ **គួរប្រើ៖**
- User authentication
- Theme (dark/light)
- Language/locale
- App-wide settings

❌ **មិនគួរប្រើ៖**
- ទិន្នន័យ change ញឹកញាប់ (form input)
- ទិន្នន័យចន្លោះ ២ component ប៉ុណ្ណោះ
- State ស្មុគស្មាញ → ប្រើ Redux / Zustand

---

## 📝 លំហាត់

1. បង្កើត `LanguageContext` សម្រាប់ Khmer/English
2. បង្កើត `CartContext` សម្រាប់ shopping cart
3. បង្កើត `NotificationContext` បង្ហាញ toast messages
4. បង្កើត `SidebarContext` ដើម្បី toggle sidebar
5. បន្សំ Dark Mode + Auth ក្នុង app តែមួយ

---

## ✅ សង្ខេប

| ជំហាន | Code |
|------|------|
| Create | `const Ctx = createContext()` |
| Provide | `<Ctx.Provider value={...}>` |
| Consume | `const x = useContext(Ctx)` |
| Custom hook | `export const useX = () => useContext(Ctx)` |

➡️ **បន្ទាប់៖** [មេរៀនទី ១០ - useReducer](./10-useReducer.md)
