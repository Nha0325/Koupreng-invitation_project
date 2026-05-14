# 📘 មេរៀនទី ០៨ - useEffect Hook

## 🎯 គោលដៅមេរៀន
- យល់ដឹង Lifecycle របស់ React
- ប្រើ useEffect ត្រឹមត្រូវ
- ប្រើ Dependency Array
- Fetch data ពី API
- ប្រើ Cleanup function

---

## 1. useEffect ជាអ្វី?

**useEffect** ប្រើសម្រាប់ **side effects** ដូចជា៖
- 🌐 Fetch data ពី API
- ⏰ Timer (setTimeout, setInterval)
- 📝 Update document title
- 🎧 Event listeners
- 🧹 Cleanup

---

## 2. Lifecycle របស់ Component

```
1. Mount (កើត)        →  Component បង្ហាញដំបូង
2. Update (ផ្លាស់ប្តូរ)  →  State/Props ផ្លាស់ប្តូរ → rerender
3. Unmount (ស្លាប់)    →  Component បាត់ពីអេក្រង់
```

useEffect អនុញ្ញាតឱ្យ run code ក្នុងគ្រប់ phase ទាំងនេះ។

---

## 3. Syntax មូលដ្ឋាន

```jsx
import { useState, useEffect } from 'react';

function Component() {
  useEffect(() => {
    // Code រត់ក្រោយ render
    console.log("Component mounted!");
    
    return () => {
      // Cleanup (run មុន unmount ឬមុន rerender)
      console.log("Cleanup!");
    };
  }, [/* dependencies */]);
  
  return <div>...</div>;
}
```

---

## 4. ៣ ករណីរបស់ Dependency Array

### ករណីទី ១៖ គ្មាន Dependency (មិនដែលប្រើ!)
```jsx
useEffect(() => {
  console.log("Run after EVERY render");
});
```
⚠️ Run ក្រោយរាល់ render → ខ្ជះខ្ជាយ performance

### ករណីទី ២៖ Empty Array `[]` (Run តែម្តង)
```jsx
useEffect(() => {
  console.log("Run only ONCE on mount");
}, []);
```
✅ ដូច `componentDidMount`

### ករណីទី ៣៖ មាន Dependencies (Run ពេលផ្លាស់ប្តូរ)
```jsx
useEffect(() => {
  console.log("Run when count changes");
}, [count]);
```
✅ Run តែពេល `count` ផ្លាស់ប្តូរ

---

## 5. ឧទាហរណ៍ ៖ Document Title

```jsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);  // Run ពេល count ផ្លាស់ប្តូរ
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

## 6. Fetch Data ពី API

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);  // Run តែម្តងពេល mount
  
  if (loading) return <p>⏳ កំពុងផ្ទុក...</p>;
  if (error) return <p>❌ {error}</p>;
  
  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name} - {u.email}</li>
      ))}
    </ul>
  );
}
```

---

## 7. Search ជាមួយ API

```jsx
import { useState, useEffect } from 'react';

function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      fetch(`https://api.github.com/search/users?q=${query}`)
        .then(r => r.json())
        .then(data => setResults(data.items || []));
    }, 500);  // Debounce 500ms
    
    return () => clearTimeout(timer);  // Cleanup
  }, [query]);
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ស្វែងរក GitHub user..."
      />
      <ul>
        {results.slice(0, 5).map(u => (
          <li key={u.id}>
            <img src={u.avatar_url} width="40" /> {u.login}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 8. Cleanup Function

### ហេតុអ្វីសំខាន់?
ការមិនធ្វើ cleanup → **memory leak**!

### ឧទាហរណ៍ ១៖ Timer
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    return () => clearInterval(interval);  // ⚠️ សំខាន់!
  }, []);
  
  return <p>⏱️ {seconds}s</p>;
}
```

### ឧទាហរណ៍ ២៖ Window Resize
```jsx
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <p>Width: {width}px</p>;
}
```

### ឧទាហរណ៍ ៣៖ Cancel Fetch
```jsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });
  
  return () => controller.abort();
}, []);
```

---

## 9. Multiple useEffects

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  
  // Effect សម្រាប់ count
  useEffect(() => {
    console.log("Count changed:", count);
  }, [count]);
  
  // Effect សម្រាប់ name
  useEffect(() => {
    console.log("Name changed:", name);
  }, [name]);
  
  // Effect សម្រាប់ mount
  useEffect(() => {
    console.log("Component mounted");
  }, []);
  
  return <div>...</div>;
}
```

✅ ប្រសើរជាងដាក់ logic រួមគ្នា!

---

## 10. ⚠️ កំហុសធម្មតា

### កំហុស ១៖ Infinite Loop
```jsx
// ❌ Loop!
useEffect(() => {
  setCount(count + 1);
});  // គ្មាន deps → run ក្រោយរាល់ render → setCount → rerender → ...

// ✅ ត្រឹមត្រូវ
useEffect(() => {
  setCount(c => c + 1);
}, []);  // Run តែម្តង
```

### កំហុស ២៖ Missing Dependencies
```jsx
// ❌ ESLint warning
useEffect(() => {
  console.log(name);
}, []);  // name ត្រូវដាក់ក្នុង []

// ✅ ត្រឹមត្រូវ
useEffect(() => {
  console.log(name);
}, [name]);
```

### កំហុស ៣៖ ភ្លេច Cleanup
```jsx
// ❌ Memory leak
useEffect(() => {
  const interval = setInterval(...);
}, []);

// ✅
useEffect(() => {
  const interval = setInterval(...);
  return () => clearInterval(interval);
}, []);
```

---

## 11. Mini Project: Real-Time Clock

```jsx
import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>🕐 {time.toLocaleTimeString('km-KH')}</h1>
      <p>{time.toLocaleDateString('km-KH', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
    </div>
  );
}
```

---

## 12. Mini Project: localStorage Sync

```jsx
import { useState, useEffect } from 'react';

function NotePad() {
  const [note, setNote] = useState(() => {
    return localStorage.getItem('note') || '';
  });
  
  useEffect(() => {
    localStorage.setItem('note', note);
  }, [note]);
  
  return (
    <div>
      <h2>📝 ​Notepad (Auto-save)</h2>
      <textarea 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="10"
        cols="50"
        placeholder="សរសេរ note..."
      />
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត Countdown Timer (10 → 0)
2. បង្កើត Stopwatch (Start/Stop/Reset)
3. បង្កើត Quote Generator ដែល fetch ពី API
4. បង្កើត Mouse Tracker បង្ហាញ x, y coordinates
5. បង្កើត Online Status (online/offline detector)

---

## ✅ សង្ខេប

| Pattern | Dependency | ពេលណា run |
|---------|-----------|----------|
| `useEffect(fn)` | គ្មាន | ក្រោយរាល់ render |
| `useEffect(fn, [])` | empty | ម្តងពេល mount |
| `useEffect(fn, [x])` | `[x]` | ពេល x ផ្លាស់ប្តូរ |
| Cleanup | `return () => {...}` | មុន unmount ឬ rerender |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៩ - useContext](./09-useContext.md)
