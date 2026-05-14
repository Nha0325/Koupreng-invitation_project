# 📘 មេរៀនទី ១៣ - Custom Hooks

## 🎯 គោលដៅមេរៀន
- យល់ដឹង Custom Hooks
- បង្កើត reusable hooks
- រៀន hooks ល្បីៗ (useFetch, useLocalStorage, useDebounce)
- ច្បាប់របស់ Hooks

---

## 1. Custom Hook ជាអ្វី?

**Custom Hook** = JavaScript function ដែល៖
- ឈ្មោះចាប់ផ្តើមដោយ `use`
- អាចហៅ Hooks ផ្សេងទៀតខាងក្នុង (useState, useEffect, etc.)
- Reusable ទូទាំង app

### ហេតុអ្វីត្រូវប្រើ?
- ✅ Reuse logic (DRY principle)
- ✅ Cleaner components
- ✅ Easy to test

---

## 2. ច្បាប់របស់ Hooks

1. **ឈ្មោះត្រូវចាប់ផ្តើមដោយ `use`**
2. **ហៅ​តែខាងក្នុង Component ឬ Hook ផ្សេង**
3. **កុំហៅក្នុង if/loop/nested function**

---

## 3. Custom Hook ដំបូង៖ useCounter

```jsx
// hooks/useCounter.js
import { useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  
  return { count, increment, decrement, reset };
}
```

### ការប្រើ
```jsx
import { useCounter } from './hooks/useCounter';

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ប្រើ ច្រើនកន្លែង
function AnotherCounter() {
  const { count, increment } = useCounter(100);
  return <button onClick={increment}>{count}</button>;
}
```

---

## 4. useLocalStorage

ផ្ទុក/ទាញ data ពី localStorage។

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  }, [key, value]);
  
  return [value, setValue];
}
```

### ការប្រើ
```jsx
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [name, setName] = useLocalStorage('name', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ឈ្មោះ (auto-save)"
      />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Theme: {theme}
      </button>
    </div>
  );
}
```

---

## 5. useFetch

ងាយស្រួលបំផុតក្នុង React!

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!url) return;
    
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}
```

### ការប្រើ
```jsx
function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');
  
  if (loading) return <p>⏳ Loading...</p>;
  if (error) return <p>❌ {error}</p>;
  
  return (
    <ul>
      {data.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

---

## 6. useDebounce

ពន្យារពេលការផ្លាស់ប្តូរតម្លៃ - ល្អសម្រាប់ search!

```jsx
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debounced;
}
```

### ការប្រើ
```jsx
function SearchBox() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  // Trigger search 500ms ក្រោយពេលឈប់ type
  useEffect(() => {
    if (debouncedSearch) {
      console.log("Searching:", debouncedSearch);
      // API call here
    }
  }, [debouncedSearch]);
  
  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## 7. useToggle

```jsx
// hooks/useToggle.js
import { useState, useCallback } from 'react';

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse }];
}
```

### ការប្រើ
```jsx
function Modal() {
  const [isOpen, { toggle, setFalse }] = useToggle();
  
  return (
    <div>
      <button onClick={toggle}>{isOpen ? 'Hide' : 'Show'}</button>
      
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </div>
  );
}
```

---

## 8. useWindowSize

```jsx
// hooks/useWindowSize.js
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

### ការប្រើ
```jsx
function ResponsiveApp() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      <p>Width: {width}px</p>
    </div>
  );
}
```

---

## 9. usePrevious

```jsx
// hooks/usePrevious.js
import { useEffect, useRef } from 'react';

export function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}
```

### ការប្រើ
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Now: {count}</p>
      <p>Was: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

---

## 10. useOnlineStatus

```jsx
// hooks/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return online;
}
```

### ការប្រើ
```jsx
function StatusBadge() {
  const online = useOnlineStatus();
  
  return (
    <span style={{ color: online ? 'green' : 'red' }}>
      {online ? '🟢 Online' : '🔴 Offline'}
    </span>
  );
}
```

---

## 11. បន្សំ Hooks ច្រើន

```jsx
// hooks/useSearchUsers.js
export function useSearchUsers(query) {
  const debouncedQuery = useDebounce(query, 500);
  const url = debouncedQuery 
    ? `https://api.github.com/search/users?q=${debouncedQuery}` 
    : null;
  
  const { data, loading, error } = useFetch(url);
  
  return {
    users: data?.items || [],
    loading,
    error
  };
}
```

```jsx
function GithubSearch() {
  const [query, setQuery] = useState("");
  const { users, loading, error } = useSearchUsers(query);
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search GitHub..."
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {users.map(u => <li key={u.id}>{u.login}</li>)}
      </ul>
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត `useTimer` (start/stop/reset)
2. បង្កើត `useClickOutside` (close dropdown when click outside)
3. បង្កើត `useGeolocation` យកទីតាំង user
4. បង្កើត `useScroll` (track scroll position)
5. បង្កើត `useForm` សម្រាប់ form management

---

## ✅ សង្ខេប

| Hook | ការប្រើ |
|------|---------|
| useCounter | Counter logic |
| useLocalStorage | Sync ជាមួយ localStorage |
| useFetch | API calls |
| useDebounce | Delay value updates |
| useToggle | Boolean state |
| useWindowSize | Window dimensions |
| usePrevious | Track previous value |

🎉 **អបអរសាទរ! អ្នកបានបញ្ចប់មេរៀន React ទាំង ១៣!**

➡️ **បន្ទាប់៖** [Project ០១ - Todo App](./project-01-todo-app.md)
