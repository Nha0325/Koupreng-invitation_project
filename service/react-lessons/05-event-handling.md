# 📘 មេរៀនទី ០៥ - Event Handling

## 🎯 គោលដៅមេរៀន
- រៀន React events: onClick, onChange, onSubmit
- Keyboard events: onKeyDown, onKeyPress
- Mouse events: onMouseEnter, onMouseLeave
- Event object និង preventDefault
- បង្កើត interactive UI

---

## 1. Event ជាអ្វី?

**Event** = សកម្មភាពរបស់អ្នកប្រើប្រាស់៖
- ចុច (click)
- វាយ (type)
- រំកិល mouse
- ផ្ញើ form

React ស្តាប់ events ហើយដំណើរការ function ដែលអ្នកកំណត់។

---

## 2. onClick Event

### Syntax មូលដ្ឋាន
```jsx
<button onClick={functionName}>Click</button>
```

### ឧទាហរណ៍ ៣ វិធី
```jsx
function App() {
  // វិធី ១៖ ប្រកាសមុន
  function handleClick() {
    alert("បានចុច!");
  }
  
  return (
    <div>
      {/* វិធី ១៖ ប្រើ function name */}
      <button onClick={handleClick}>Click 1</button>
      
      {/* វិធី ២៖ ប្រើ inline arrow function */}
      <button onClick={() => alert("Inline!")}>Click 2</button>
      
      {/* វិធី ៣៖ បញ្ជូន arguments */}
      <button onClick={() => greet("សុខា")}>Click 3</button>
    </div>
  );
}

function greet(name) {
  alert(`សួស្តី ${name}!`);
}
```

### ⚠️ កំហុសធម្មតា
```jsx
// ❌ ខុស - function ដំណើរការភ្លាមៗពេល render!
<button onClick={handleClick()}>Click</button>

// ✅ ត្រឹមត្រូវ
<button onClick={handleClick}>Click</button>
<button onClick={() => handleClick()}>Click</button>
```

---

## 3. Event Object

```jsx
function App() {
  function handleClick(event) {
    console.log(event);              // Event object
    console.log(event.target);       // Element ដែលបានចុច
    console.log(event.target.value); // Value
    console.log(event.type);         // "click"
  }
  
  return <button onClick={handleClick}>Click</button>;
}
```

---

## 4. onChange Event (Form Inputs)

```jsx
import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState("");
  
  function handleChange(e) {
    setName(e.target.value);
  }
  
  return (
    <div>
      <input 
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="វាយឈ្មោះ"
      />
      <p>សួស្តី, {name || "..."}!</p>
    </div>
  );
}
```

### Multiple Inputs
```jsx
function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: ""
  });
  
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  
  return (
    <div>
      <input name="name" onChange={handleChange} placeholder="ឈ្មោះ" />
      <input name="email" onChange={handleChange} placeholder="អ៊ីមែល" />
      <input name="age" onChange={handleChange} placeholder="អាយុ" />
      
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}
```

---

## 5. onSubmit Event (Form)

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  function handleSubmit(e) {
    e.preventDefault();  // ⚠️ បញ្ឈប់ការ reload page
    
    console.log("Email:", email);
    console.log("Password:", password);
    
    // ផ្ញើទៅ server...
  }
  
  return (
    <form onSubmit={handleSubmit}>
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
```

### ⚠️ `e.preventDefault()` សំខាន់!
បើគ្មាន page នឹង **reload** ហើយបាត់បង់ data។

---

## 6. Keyboard Events

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");
  
  function handleKeyDown(e) {
    console.log("Key:", e.key);
    
    if (e.key === "Enter") {
      alert(`ស្វែងរក: ${query}`);
    }
    
    if (e.key === "Escape") {
      setQuery("");
    }
  }
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="ស្វែងរក... (Enter or Esc)"
    />
  );
}
```

### Keyboard Events ផ្សេងៗ
- `onKeyDown` - ចុច key (មុនបញ្ចេញ)
- `onKeyUp` - លែង key
- `onKeyPress` - ចុច key (deprecated, use onKeyDown)

---

## 7. Mouse Events

```jsx
function HoverCard() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '20px',
        backgroundColor: hovered ? 'lightblue' : 'lightgray',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
    >
      {hovered ? '🎉 Hovered!' : '👋 Hover me'}
    </div>
  );
}
```

### Mouse Events ផ្សេងៗ
- `onClick` - ចុច
- `onDoubleClick` - ចុច ២ ដង
- `onMouseEnter` - mouse មកលើ
- `onMouseLeave` - mouse ចេញ
- `onMouseMove` - mouse រំកិល
- `onContextMenu` - ចុចស្តាំ

---

## 8. Focus Events

```jsx
function FocusInput() {
  const [focused, setFocused] = useState(false);
  
  return (
    <input 
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        border: focused ? '2px solid blue' : '1px solid gray',
        padding: '10px'
      }}
      placeholder={focused ? "កំពុងវាយ..." : "ចុចទីនេះ"}
    />
  );
}
```

---

## 9. Mini Project: Interactive Color Box

```jsx
import { useState } from 'react';

function ColorBox() {
  const [color, setColor] = useState("white");
  const [count, setCount] = useState(0);
  
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  
  function changeColor() {
    const random = colors[Math.floor(Math.random() * colors.length)];
    setColor(random);
    setCount(count + 1);
  }
  
  function reset() {
    setColor("white");
    setCount(0);
  }
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div 
        onClick={changeColor}
        onDoubleClick={reset}
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: color,
          margin: '0 auto',
          borderRadius: '8px',
          border: '2px solid #333',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
      >
        <p>ចុច {count} ដង</p>
      </div>
      <p style={{ marginTop: '10px' }}>
        ចុចម្តង = ផ្លាស់ប្តូរពណ៌<br/>
        ចុចពីរដង = Reset
      </p>
    </div>
  );
}
```

---

## 10. Mini Project: Calculator

```jsx
import { useState } from 'react';

function Calculator() {
  const [display, setDisplay] = useState("0");
  
  function handleClick(value) {
    if (display === "0") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  }
  
  function calculate() {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay("Error");
    }
  }
  
  function clear() {
    setDisplay("0");
  }
  
  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
  
  return (
    <div style={{ maxWidth: '300px', margin: '20px auto', padding: '10px', border: '1px solid #ccc' }}>
      <input 
        value={display}
        readOnly
        style={{ width: '100%', textAlign: 'right', fontSize: '24px', padding: '10px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginTop: '10px' }}>
        {buttons.map(btn => (
          <button 
            key={btn}
            onClick={() => btn === '=' ? calculate() : handleClick(btn)}
            style={{ padding: '15px', fontSize: '18px' }}
          >
            {btn}
          </button>
        ))}
      </div>
      <button 
        onClick={clear} 
        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
      >
        Clear
      </button>
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត Toggle Button (Show/Hide text)
2. បង្កើត Like Button រាប់ចំនួន like
3. បង្កើត Search Box ស្តាប់ Enter key
4. បង្កើត Drawing Canvas ប្រើ mouse events
5. បង្កើត Quiz App ជាមួយ multiple choice questions

---

## ✅ សង្ខេប

| Event | ការប្រើ |
|-------|--------|
| onClick | ចុច |
| onChange | input change |
| onSubmit | submit form |
| onKeyDown | ចុច key |
| onMouseEnter/Leave | hover |
| onFocus/onBlur | input focus |
| `e.preventDefault()` | បញ្ឈប់ default behavior |
| `e.target.value` | យក value |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៦ - Conditional Rendering](./06-conditional-rendering.md)
