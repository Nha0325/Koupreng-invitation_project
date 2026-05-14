# 📘 មេរៀនទី ០៤ - useState Hook

## 🎯 គោលដៅមេរៀន
- យល់ដឹង State ជាអ្វី
- រៀន useState hook
- Update state យ៉ាងត្រឹមត្រូវ
- ធ្វើការជាមួយ array state និង object state
- បង្កើត Counter, Todo, និង Form

---

## 1. State ជាអ្វី?

**State** គឺជា **ទិន្នន័យដែលផ្លាស់ប្តូរបាន** ក្នុង component។

ឧទាហរណ៍៖
- ចំនួន counter (0, 1, 2, 3...)
- ឈ្មោះអ្នកប្រើ (សុខា, ដាវី...)
- បញ្ជី todos (បន្ថែម/លុប)
- Form input (អ្វីអ្នកប្រើ type)

ពេល state ផ្លាស់ប្តូរ React **rerender** component ដោយស្វ័យប្រវត្តិ!

---

## 2. ហេតុអ្វីត្រូវការ useState?

```jsx
// ❌ វិធីខុស (មិនដំណើរការ)
function Counter() {
  let count = 0;
  
  function increment() {
    count = count + 1;
    console.log(count);  // បង្ហាញលេខប៉ុន្តែ UI មិនផ្លាស់ប្តូរ!
  }
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

**បញ្ហា៖** Variable ផ្លាស់ប្តូរ ប៉ុន្តែ UI មិន rerender ទេ។

```jsx
// ✅ វិធីត្រឹមត្រូវ ប្រើ useState
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

## 3. Syntax របស់ useState

```jsx
const [state, setState] = useState(initialValue);
```

- `state` = តម្លៃបច្ចុប្បន្ន
- `setState` = function ដើម្បីផ្លាស់ប្តូរ state
- `initialValue` = តម្លៃដំបូង

### ឧទាហរណ៍ច្រើនប្រភេទ
```jsx
const [name, setName] = useState("សុខា");          // string
const [age, setAge] = useState(25);                // number
const [isOnline, setIsOnline] = useState(true);    // boolean
const [user, setUser] = useState({ name: "សុខា" }); // object
const [items, setItems] = useState([]);            // array
const [data, setData] = useState(null);            // null
```

---

## 4. Counter ឧទាហរណ៍ពេញលេញ

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>➕ បន្ថែម</button>
      <button onClick={() => setCount(count - 1)}>➖ ដក</button>
      <button onClick={() => setCount(0)}>🔄 Reset</button>
    </div>
  );
}

export default Counter;
```

---

## 5. ⚠️ Update State អោយត្រឹមត្រូវ

### បញ្ហា៖ State ជា asynchronous

```jsx
// ❌ មិនដំណើរការត្រឹមត្រូវ
function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // បន្ទាប់ពី click count = 1 ទេ! (មិនមែន 3)
  }
  
  return <button onClick={handleClick}>+3</button>;
}
```

### ដំណោះស្រាយ៖ ប្រើ Function Form

```jsx
// ✅ ដំណើរការត្រឹមត្រូវ
function handleClick() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // ឥឡូវ count = 3 ✅
}
```

**ច្បាប់៖** ប្រើ function form ពេល new value ផ្អែកលើ old value។

---

## 6. Object State

```jsx
import { useState } from 'react';

function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0
  });
  
  function updateName(newName) {
    // ❌ ខុស - លុបទិន្នន័យដទៃ
    // setUser({ name: newName });
    
    // ✅ ត្រឹមត្រូវ - រក្សាទុកទិន្នន័យដទៃដោយប្រើ spread
    setUser({ ...user, name: newName });
  }
  
  return (
    <div>
      <input 
        value={user.name} 
        onChange={(e) => updateName(e.target.value)}
        placeholder="ឈ្មោះ"
      />
      <input 
        value={user.email} 
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="អ៊ីមែល"
      />
      <input 
        type="number"
        value={user.age} 
        onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
        placeholder="អាយុ"
      />
      
      <h3>បង្ហាញ៖</h3>
      <p>ឈ្មោះ៖ {user.name}</p>
      <p>អ៊ីមែល៖ {user.email}</p>
      <p>អាយុ៖ {user.age}</p>
    </div>
  );
}
```

---

## 7. Array State

### បន្ថែមធាតុ
```jsx
const [fruits, setFruits] = useState(["ស្វាយ", "ក្រូច"]);

// ❌ ខុស - mutate array
fruits.push("អាប់ផ្លែ");

// ✅ ត្រឹមត្រូវ - បង្កើត array ថ្មី
setFruits([...fruits, "អាប់ផ្លែ"]);
```

### លុបធាតុ
```jsx
// លុបធាតុដែលមាន index = 1
setFruits(fruits.filter((_, i) => i !== 1));

// ឬលុបតាមតម្លៃ
setFruits(fruits.filter(f => f !== "ស្វាយ"));
```

### កែធាតុ
```jsx
setFruits(fruits.map((f, i) => i === 1 ? "ផ្លែឆ្មារ" : f));
```

---

## 8. Todo List ពេញលេញ

```jsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  
  function addTodo() {
    if (input.trim() === "") return;
    
    const newTodo = {
      id: Date.now(),
      text: input,
      done: false
    };
    
    setTodos([...todos, newTodo]);
    setInput("");
  }
  
  function deleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }
  
  function toggleTodo(id) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  }
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>📝 Todo List</h1>
      
      <div>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="បន្ថែម task..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>➕ បន្ថែម</button>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{ 
              padding: '10px',
              borderBottom: '1px solid #eee',
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#999' : '#000'
            }}
          >
            <input 
              type="checkbox" 
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            {' '}{todo.text}{' '}
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
      
      <p>បានបញ្ចប់៖ {todos.filter(t => t.done).length} / {todos.length}</p>
    </div>
  );
}
```

---

## 9. Form ពេញលេញ

```jsx
import { useState } from 'react';

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    console.log(form);
  }
  
  if (submitted) {
    return (
      <div>
        <h2>✅ បានផ្ញើ!</h2>
        <p>អរគុណ {form.name}!</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="ឈ្មោះ" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="អ៊ីមែល" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="សារ" />
      <button type="submit">ផ្ញើ</button>
    </form>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត Counter ដែលកំណត់អប្បបរមា 0 និងអតិបរមា 10
2. បង្កើត Color Picker ផ្លាស់ប្តូរពណ៌ផ្ទៃខាងក្រោយ
3. បង្កើត Login Toggle (Login/Logout)
4. បង្កើត Todo List ដែលរក្សាទុកក្នុង localStorage
5. បង្កើត Shopping Cart បន្ថែម/លុបទំនិញ និងគណនាសរុប

---

## ✅ សង្ខេប

| គោលគំនិត | ការប្រើ |
|----------|---------|
| useState | សម្រាប់ state |
| `[value, setValue]` | Destructuring |
| setState() | Update state |
| Function form | `setX(prev => prev + 1)` |
| Object update | `setX({ ...x, key: value })` |
| Array add | `setArr([...arr, item])` |
| Array remove | `setArr(arr.filter(...))` |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៥ - Event Handling](./05-event-handling.md)
