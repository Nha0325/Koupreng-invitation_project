# 📘 មេរៀនទី ១០ - useReducer Hook

## 🎯 គោលដៅមេរៀន
- ប្រៀបធៀប useState vs useReducer
- រៀន reducer pattern
- បង្កើត Shopping Cart
- ប្រើជាមួយ Context

---

## 1. ហេតុអ្វីត្រូវការ useReducer?

**useState** ល្អសម្រាប់ state សាមញ្ញ ប៉ុន្តែ៖

❌ **useState ស្មុគស្មាញ៖**
```jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [age, setAge] = useState(0);
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
// ... ច្រើនទៀត
```

✅ **useReducer ប្រមូលផ្តុំ៖**
```jsx
const [state, dispatch] = useReducer(reducer, initialState);
// state មាន: name, email, age, items, total, loading, error
```

---

## 2. គោលគំនិតមូលដ្ឋាន

### Reducer Pattern
```
state + action → new state
```

```js
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

### Dispatch
```js
dispatch({ type: 'INCREMENT' });  // ផ្ញើ action
```

---

## 3. Counter ឧទាហរណ៍

### ជាមួយ useState
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### ជាមួយ useReducer
```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>
        Set 100
      </button>
    </div>
  );
}
```

---

## 4. ប្រៀបធៀប useState vs useReducer

| លក្ខណៈ | useState | useReducer |
|--------|----------|------------|
| ស្មុគស្មាញ | ❌ | ✅ |
| State តូច | ✅ | ❌ |
| State ច្រើន related | ❌ | ✅ |
| Logic ច្រើន | ❌ | ✅ |
| Test បាន | ⚠️ | ✅ |

### ច្បាប់សាមញ្ញ
- 1-3 useState → ប្រើ useState
- 4+ useState ដែល related → ប្រើ useReducer

---

## 5. Mini Project: Shopping Cart

### Cart Reducer
```jsx
const initialState = {
  items: [],
  total: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      
      if (existing) {
        // បន្ថែម quantity
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          total: state.total + action.payload.price
        };
      }
      
      // បន្ថែម item ថ្មី
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(i => i.id === action.payload);
      if (!item) return state;
      
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item.price * item.quantity)
      };
    }
    
    case 'INCREASE_QTY': {
      const item = state.items.find(i => i.id === action.payload);
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
        total: state.total + item.price
      };
    }
    
    case 'DECREASE_QTY': {
      const item = state.items.find(i => i.id === action.payload);
      if (!item || item.quantity <= 1) return state;
      
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
        total: state.total - item.price
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
}
```

### Cart Component
```jsx
import { useReducer } from 'react';

function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  const products = [
    { id: 1, name: "ទូរស័ព្ទ", price: 500 },
    { id: 2, name: "កុំព្យូទ័រ", price: 1200 },
    { id: 3, name: "កាមេរ៉ា", price: 800 }
  ];
  
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Products */}
      <div style={{ flex: 1 }}>
        <h2>🛍️ ផលិតផល</h2>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px' }}>
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: p })}>
              បន្ថែមទៅ Cart
            </button>
          </div>
        ))}
      </div>
      
      {/* Cart */}
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h2>🛒 Cart ({cart.items.length})</h2>
        
        {cart.items.length === 0 && <p>ទទេ</p>}
        
        {cart.items.map(item => (
          <div key={item.id} style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
            <h4>{item.name}</h4>
            <p>${item.price} × {item.quantity} = ${item.price * item.quantity}</p>
            <button onClick={() => dispatch({ type: 'INCREASE_QTY', payload: item.id })}>+</button>
            <button onClick={() => dispatch({ type: 'DECREASE_QTY', payload: item.id })}>-</button>
            <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>❌</button>
          </div>
        ))}
        
        {cart.items.length > 0 && (
          <>
            <h3>សរុប៖ ${cart.total}</h3>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
              លុប Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 6. useReducer + useContext

ការផ្គុំ ២ Hooks នេះ → **ដូច Redux តូច**!

```jsx
// CartContext.jsx
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
```

```jsx
// App.jsx
function App() {
  return (
    <CartProvider>
      <ProductList />
      <CartView />
    </CartProvider>
  );
}

function ProductList() {
  const { dispatch } = useCart();
  // ...
}

function CartView() {
  const { state } = useCart();
  // ...
}
```

---

## 7. Form ស្មុគស្មាញ

```jsx
const initialForm = {
  name: "",
  email: "",
  password: "",
  agree: false,
  errors: {},
  submitting: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { 
        ...state, 
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null }
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SUBMIT_START':
      return { ...state, submitting: true };
    case 'SUBMIT_SUCCESS':
      return initialForm;
    case 'SUBMIT_ERROR':
      return { ...state, submitting: false, errors: action.errors };
    default:
      return state;
  }
}

function RegisterForm() {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  
  function setField(field, value) {
    dispatch({ type: 'SET_FIELD', field, value });
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });
    
    try {
      // API call
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'SUBMIT_ERROR', errors: err.errors });
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={form.name}
        onChange={(e) => setField('name', e.target.value)}
        placeholder="ឈ្មោះ"
      />
      {/* ... */}
    </form>
  );
}
```

---

## 📝 លំហាត់

1. បំលែង Counter ដែលអ្នកសរសេរក្នុងមេរៀន ៤ ទៅ useReducer
2. បង្កើត Todo List ដោយប្រើ useReducer
3. បង្កើត Form Wizard (multi-step) ប្រើ useReducer
4. បន្សំ Cart Context + useReducer
5. បង្កើត Game State (score, lives, level) ប្រើ useReducer

---

## ✅ សង្ខេប

| គោលគំនិត | ការប្រើ |
|----------|---------|
| `useReducer(reducer, initial)` | Hook |
| `dispatch({ type, payload })` | Trigger action |
| Reducer | Pure function |
| useState vs useReducer | សាមញ្ញ vs ស្មុគស្មាញ |
| useReducer + Context | Redux តូច |

➡️ **បន្ទាប់៖** [មេរៀនទី ១១ - React Router](./11-react-router.md)
