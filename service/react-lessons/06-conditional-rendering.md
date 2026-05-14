# 📘 មេរៀនទី ០៦ - Conditional Rendering

## 🎯 គោលដៅមេរៀន
- រៀន if/else ក្នុង React
- ប្រើ ternary operator
- ប្រើ && operator
- បង្កើត Login/Logout system

---

## 1. Conditional Rendering ជាអ្វី?

**Conditional Rendering** = បង្ហាញ UI **ផ្អែកលើលក្ខខណ្ឌ**

ឧទាហរណ៍៖
- ប្រសិនបើ login → បង្ហាញ Dashboard
- ប្រសិនបើ logout → បង្ហាញ Login Form

---

## 2. វិធីទី ១៖ if/else (មុន return)

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>👋 សួស្តី សុខា!</h1>;
  } else {
    return <h1>🔐 សូមចូលប្រើ</h1>;
  }
}

// ប្រើ
<Greeting isLoggedIn={true} />   // 👋 សួស្តី សុខា!
<Greeting isLoggedIn={false} />  // 🔐 សូមចូលប្រើ
```

### ឬ early return
```jsx
function Greeting({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <h1>🔐 សូមចូលប្រើ</h1>;
  }
  
  return <h1>👋 សួស្តី សុខា!</h1>;
}
```

---

## 3. វិធីទី ២៖ Ternary Operator (`? :`)

ប្រើក្នុង JSX ផ្ទាល់៖

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <h1>
      {isLoggedIn ? "👋 សួស្តី!" : "🔐 សូមចូលប្រើ"}
    </h1>
  );
}
```

### ឧទាហរណ៍ច្រើនជាង
```jsx
function Status({ status }) {
  return (
    <div>
      <p>
        {status === "online" 
          ? "🟢 Online" 
          : status === "away" 
          ? "🟡 Away" 
          : "🔴 Offline"}
      </p>
    </div>
  );
}
```

### ប្រើជាមួយ Component
```jsx
function App({ user }) {
  return (
    <div>
      {user 
        ? <Dashboard user={user} /> 
        : <LoginForm />
      }
    </div>
  );
}
```

---

## 4. វិធីទី ៣៖ && Operator

ប្រើពេលអ្នកចង់បង្ហាញតែ **ករណីមួយ** (មិនមាន else)៖

```jsx
function Notification({ hasMessage }) {
  return (
    <div>
      <h1>Inbox</h1>
      {hasMessage && <p>📨 មានសារថ្មី!</p>}
    </div>
  );
}
```

### វិធីដំណើរការ
```js
true && "Hello"   // → "Hello"
false && "Hello"  // → false (មិនបង្ហាញអ្វី)
```

### ឧទាហរណ៍
```jsx
function Cart({ items }) {
  return (
    <div>
      <h1>🛒 Cart</h1>
      
      {items.length > 0 && (
        <p>មាន {items.length} ទំនិញ</p>
      )}
      
      {items.length === 0 && (
        <p>ទទេ</p>
      )}
    </div>
  );
}
```

### ⚠️ ប្រយ័ត្ន៖ លេខ 0

```jsx
const count = 0;

// ❌ បញ្ហា - បង្ហាញ "0" ក្នុង UI!
{count && <p>មាន {count}</p>}

// ✅ ត្រឹមត្រូវ
{count > 0 && <p>មាន {count}</p>}
```

---

## 5. ប្រៀបធៀប ៣ វិធី

| វិធី | ប្រើនៅពេល |
|-----|----------|
| `if/else` | មុន return, លក្ខខណ្ឌស្មុគស្មាញ |
| `? :` | ខ្លី មាន 2 ករណី (true/false) |
| `&&` | មានតែករណី true |

---

## 6. ឧទាហរណ៍ Login/Logout ពេញលេញ

```jsx
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  
  function login() {
    setUser({ name: "សុខា", email: "sokha@email.com" });
  }
  
  function logout() {
    setUser(null);
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>🌐 Welcome</h1>
      
      {user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <LoginForm onLogin={login} />
      )}
    </div>
  );
}

function LoginForm({ onLogin }) {
  return (
    <div>
      <h2>🔐 Login</h2>
      <button onClick={onLogin}>Login as សុខា</button>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <div>
      <h2>👋 សួស្តី, {user.name}!</h2>
      <p>📧 {user.email}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
```

---

## 7. Loading State

```jsx
import { useState } from 'react';

function DataLoader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  async function loadData() {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://api.example.com/data');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <button onClick={loadData} disabled={loading}>
        {loading ? "កំពុងផ្ទុក..." : "ផ្ទុកទិន្នន័យ"}
      </button>
      
      {loading && <p>⏳ កំពុងរង់ចាំ...</p>}
      
      {error && (
        <p style={{ color: 'red' }}>❌ កំហុស៖ {error}</p>
      )}
      
      {data && (
        <div>
          <h3>✅ ទិន្នន័យ៖</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 8. ការផ្លាស់ប្តូរ Theme

```jsx
import { useState } from 'react';

function ThemeApp() {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <div style={{
      backgroundColor: isDark ? '#222' : '#fff',
      color: isDark ? '#fff' : '#222',
      minHeight: '100vh',
      padding: '20px',
      transition: 'all 0.3s'
    }}>
      <h1>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</h1>
      
      <button onClick={() => setIsDark(!isDark)}>
        ប្តូរទៅ {isDark ? 'Light' : 'Dark'}
      </button>
      
      <p>មាតិកា website</p>
    </div>
  );
}
```

---

## 9. Multi-Step Form

```jsx
import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  
  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <p>ជំហានទី {step} / 3</p>
      
      {step === 1 && (
        <div>
          <h2>ជំហានទី ១៖ ឈ្មោះ</h2>
          <input placeholder="ឈ្មោះ" />
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h2>ជំហានទី ២៖ អ៊ីមែល</h2>
          <input placeholder="អ៊ីមែល" />
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h2>ជំហានទី ៣៖ បញ្ជាក់</h2>
          <p>បានបញ្ចប់!</p>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>⬅️ ថយក្រោយ</button>
        )}
        {step < 3 && (
          <button onClick={() => setStep(step + 1)}>បន្ទាប់ ➡️</button>
        )}
      </div>
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត `<Weather />` បង្ហាញរូបផ្សេងៗតាម temperature
2. បង្កើត Login/Register toggle form
3. បង្កើត User Profile ដែលលាក់/បង្ហាញ email
4. បង្កើត Quiz App ដែលបង្ហាញលទ្ធផលពេលបញ្ចប់
5. បង្កើត Pricing Page បង្ហាញ "FREE" ឬ "PREMIUM"

---

## ✅ សង្ខេប

| វិធី | Syntax |
|-----|--------|
| if/else | មុន return |
| Ternary | `cond ? A : B` |
| && | `cond && A` |
| Multi-condition | nested ternary |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៧ - List Rendering](./07-list-rendering.md)
