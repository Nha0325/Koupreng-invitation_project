# 🎯 Project ០១ - Todo App ពេញលេញ

## 🎯 គោលដៅគម្រោង
សាងសង់ Todo App ពិតប្រាកដ ដែលរួមមាន៖
- បន្ថែម tasks
- កែប្រែ tasks
- លុប tasks
- Mark complete
- Filter (All / Active / Completed)
- រក្សាទុកក្នុង localStorage

---

## 📦 Setup

```bash
npm create vite@latest todo-app -- --template react
cd todo-app
npm install
npm run dev
```

---

## 📁 Project Structure

```
todo-app/
├── src/
│   ├── components/
│   │   ├── TodoForm.jsx
│   │   ├── TodoList.jsx
│   │   ├── TodoItem.jsx
│   │   └── FilterBar.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── package.json
```

---

## 1. Custom Hook: useLocalStorage

```jsx
// src/hooks/useLocalStorage.js
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
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

---

## 2. Component: TodoForm

```jsx
// src/components/TodoForm.jsx
import { useState } from 'react';

function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  
  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAdd(text.trim());
    setText("");
  }
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="តើ​ត្រូវធ្វើអ្វី?"
      />
      <button type="submit">➕ បន្ថែម</button>
    </form>
  );
}

export default TodoForm;
```

---

## 3. Component: TodoItem

```jsx
// src/components/TodoItem.jsx
import { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  
  function handleSave() {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setEditing(false);
    }
  }
  
  function handleCancel() {
    setEditText(todo.text);
    setEditing(false);
  }
  
  if (editing) {
    return (
      <li className="todo-item">
        <input 
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
        />
        <button onClick={handleSave}>✅</button>
        <button onClick={handleCancel}>❌</button>
      </li>
    );
  }
  
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span 
        onDoubleClick={() => setEditing(true)}
        title="Double click ដើម្បីកែ"
      >
        {todo.text}
      </span>
      <div className="actions">
        <button onClick={() => setEditing(true)}>✏️</button>
        <button onClick={() => onDelete(todo.id)}>🗑️</button>
      </div>
    </li>
  );
}

export default TodoItem;
```

---

## 4. Component: TodoList

```jsx
// src/components/TodoList.jsx
import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 មិនមាន tasks</p>
      </div>
    );
  }
  
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
```

---

## 5. Component: FilterBar

```jsx
// src/components/FilterBar.jsx
function FilterBar({ filter, setFilter, counts }) {
  const filters = [
    { key: 'all', label: 'ទាំងអស់', count: counts.all },
    { key: 'active', label: 'កំពុងធ្វើ', count: counts.active },
    { key: 'completed', label: 'បានបញ្ចប់', count: counts.completed }
  ];
  
  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button 
          key={f.key}
          className={filter === f.key ? 'active' : ''}
          onClick={() => setFilter(f.key)}
        >
          {f.label} ({f.count})
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
```

---

## 6. Main App

```jsx
// src/App.jsx
import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import './App.css';

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [filter, setFilter] = useState('all');
  
  function addTodo(text) {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
  }
  
  function toggleTodo(id) {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }
  
  function deleteTodo(id) {
    setTodos(todos.filter(t => t.id !== id));
  }
  
  function editTodo(id, newText) {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, text: newText } : t
    ));
  }
  
  function clearCompleted() {
    setTodos(todos.filter(t => !t.completed));
  }
  
  // Filter
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  // Counts
  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }), [todos]);
  
  return (
    <div className="app">
      <header>
        <h1>📝 Todo App</h1>
        <p>គ្រប់គ្រងការងារប្រចាំថ្ងៃ</p>
      </header>
      
      <main>
        <TodoForm onAdd={addTodo} />
        
        <FilterBar 
          filter={filter}
          setFilter={setFilter}
          counts={counts}
        />
        
        <TodoList 
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
        
        {counts.completed > 0 && (
          <div className="footer">
            <button onClick={clearCompleted}>
              លុបការងារដែលបញ្ចប់ ({counts.completed})
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

---

## 7. Styles

```css
/* src/App.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Khmer OS', Arial, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
}

.app {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  font-size: 36px;
  color: #333;
}

header p {
  color: #666;
  margin-top: 5px;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-form input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.todo-form input:focus {
  outline: none;
  border-color: #4a90e2;
}

.todo-form button {
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.todo-form button:hover {
  background: #357abd;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.filter-bar button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.filter-bar button.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #eee;
  transition: all 0.2s;
}

.todo-item:hover {
  background: #f9f9f9;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}

.todo-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-item span {
  flex: 1;
  cursor: pointer;
  font-size: 16px;
}

.todo-item .actions {
  display: flex;
  gap: 5px;
}

.todo-item .actions button {
  padding: 6px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background 0.2s;
}

.todo-item .actions button:hover {
  background: #f0f0f0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.footer {
  margin-top: 20px;
  text-align: center;
}

.footer button {
  padding: 8px 16px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.footer button:hover {
  background: #ee5a5a;
}
```

---

## ✅ លក្ខណៈពិសេស

✨ បន្ថែម / លុប / កែ todos  
✨ Mark complete  
✨ Filter (All / Active / Completed)  
✨ Auto-save ក្នុង localStorage  
✨ Edit ដោយ double-click  
✨ Keyboard shortcuts (Enter / Escape)  
✨ Counter លើ filter buttons  
✨ Empty state  
✨ Responsive design  

---

## 🚀 ពង្រីកគម្រោងបន្ថែម

1. បន្ថែម categories (Work, Personal)
2. បន្ថែម priority (High, Medium, Low)
3. បន្ថែម due date
4. បន្ថែម drag-and-drop reorder
5. បន្ថែម dark mode
6. បន្ថែម multiple todo lists
7. បន្ថែម search
8. Export/Import JSON

➡️ **បន្ទាប់៖** [Project ០២ - Weather App](./project-02-weather-app.md)
