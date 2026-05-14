# 📘 មេរៀនទី ១២ - useMemo & useCallback

## 🎯 គោលដៅមេរៀន
- យល់ដឹង React rerender
- ប្រើ useMemo សម្រាប់ value
- ប្រើ useCallback សម្រាប់ functions
- ប្រើ React.memo
- Optimize performance

---

## 1. បញ្ហា Performance

ពេល state ផ្លាស់ប្តូរ → React **rerender** component ទាំងអស់ខាងក្នុង។

```jsx
function App() {
  const [count, setCount] = useState(0);
  
  // ⚠️ គណនាស្មុគស្មាញ rerun ​រាល់ render
  const expensiveValue = computeExpensive();
  
  return <div>{count}</div>;
}
```

ប្រសិនបើ `computeExpensive()` យឺត → app នឹង lag!

---

## 2. useMemo - Cache Value

```jsx
import { useMemo } from 'react';

const memoized = useMemo(() => computeExpensive(), [deps]);
```

- Cache លទ្ធផល
- Recalculate តែពេល deps ផ្លាស់ប្តូរ

### ឧទាហរណ៍
```jsx
import { useState, useMemo } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  
  // ❌ មិន memoize - rerun ​រាល់ render
  const slowValue = slowFunction(count);
  
  // ✅ Memoize - rerun តែពេល count ផ្លាស់ប្តូរ
  const fastValue = useMemo(() => slowFunction(count), [count]);
  
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Count: {count}</p>
      <p>Result: {fastValue}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

function slowFunction(num) {
  console.log("Computing...");
  for (let i = 0; i < 1000000000; i++) {} // យឺត
  return num * 2;
}
```

ពេលអ្នក type ក្នុង input៖
- ❌ មិន memoize → app freeze
- ✅ Memoize → smooth!

---

## 3. ⚠️ ពេលណាគួរប្រើ useMemo?

✅ **ប្រើ៖**
- គណនាស្មុគស្មាញ
- Filter/sort large arrays
- ការផ្លាស់ប្តូរទិន្នន័យធំ

❌ **កុំប្រើ៖**
- Operation តូចៗ (`a + b`)
- ត្រឹមតែ "ល្អមើលទៅ"
- បន្ថែម complexity ដោយគ្មានគុណប្រយោជន៍

> Premature optimization is the root of all evil.

---

## 4. useCallback - Cache Function

```jsx
import { useCallback } from 'react';

const memoizedFn = useCallback(() => doSomething(deps), [deps]);
```

ដូច useMemo ប៉ុន្តែសម្រាប់ **functions**!

### បញ្ហាគ្មាន useCallback
```jsx
function App() {
  const [count, setCount] = useState(0);
  
  // ⚠️ Function ថ្មីរាល់ render
  const handleClick = () => {
    console.log("Clicked");
  };
  
  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  console.log("Child rerender");
  return <button onClick={onClick}>Click</button>;
});
```

ពេល App rerender → `handleClick` ថ្មី → Child rerender (ទោះបី memo)!

### ដំណោះស្រាយ៖ useCallback
```jsx
function App() {
  const [count, setCount] = useState(0);
  
  // ✅ Function ដដែលរាល់ render
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

---

## 5. React.memo

រុំ component ដើម្បីការពារ unnecessary rerenders៖

```jsx
import { memo } from 'react';

const Button = memo(function Button({ onClick, label }) {
  console.log("Button rendered:", label);
  return <button onClick={onClick}>{label}</button>;
});
```

`React.memo` ប្រៀបធៀប props។ ប្រសិនបើដូចគ្នា → skip render។

---

## 6. ឧទាហរណ៍ Optimize ពេញលេញ

```jsx
import { useState, useMemo, useCallback, memo } from 'react';

// Child component
const ProductList = memo(function ProductList({ products, onSelect }) {
  console.log("ProductList rendered");
  
  return (
    <ul>
      {products.map(p => (
        <li key={p.id} onClick={() => onSelect(p.id)}>
          {p.name} - ${p.price}
        </li>
      ))}
    </ul>
  );
});

function App() {
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  
  const allProducts = [
    { id: 1, name: "Phone", price: 500 },
    { id: 2, name: "Laptop", price: 1000 },
    { id: 3, name: "Camera", price: 800 },
    // ... 1000 products
  ];
  
  // ✅ Memoize filtered list
  const filteredProducts = useMemo(() => {
    console.log("Filtering...");
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
  
  // ✅ Memoize callback
  const handleSelect = useCallback((id) => {
    console.log("Selected:", id);
  }, []);
  
  return (
    <div>
      <input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ស្វែងរក..."
      />
      
      {/* Counter មិន rerender ProductList */}
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      
      <ProductList 
        products={filteredProducts}
        onSelect={handleSelect}
      />
    </div>
  );
}
```

---

## 7. ប្រៀបធៀប ៣

| Hook/HOC | Cache | ករណី |
|----------|-------|------|
| `useMemo` | Value | Heavy computation |
| `useCallback` | Function | Pass to memo'd child |
| `React.memo` | Component | Pure component |

---

## 8. ពេលណាមិនគួរ Optimize?

```jsx
// ❌ មិនចាំបាច់
const sum = useMemo(() => a + b, [a, b]);

// ❌ មិនចាំបាច់
const handleClick = useCallback(() => alert("Hi"), []);

// ❌ មិនចាំបាច់
const Memoized = React.memo(SimpleStaticComponent);
```

**ច្បាប់៖** Profile មុនពេល optimize!

ប្រើ React DevTools Profiler ដើម្បីវាស់ស្ទង់។

---

## 9. Anti-Patterns

### ❌ Memoize គ្រប់យ៉ាង
```jsx
const value = useMemo(() => 1 + 1, []);  // overkill
```

### ❌ Dependencies ខុស
```jsx
const value = useMemo(() => doSomething(x, y), [x]);  // ភ្លេច y
```

### ❌ Object inline
```jsx
// ❌ Object ថ្មីរាល់ render → memo មិនដំណើរការ
<Child user={{ name: "សុខា" }} />

// ✅ Memoize
const user = useMemo(() => ({ name: "សុខា" }), []);
<Child user={user} />
```

---

## 10. Mini Project: Search Performance

```jsx
import { useState, useMemo } from 'react';

function SearchApp() {
  const [search, setSearch] = useState("");
  
  // 10,000 items
  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random()
    }));
  }, []);
  
  // Filter (memoized)
  const filtered = useMemo(() => {
    console.log("Filtering...");
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search 10,000 items..."
      />
      <p>Found: {filtered.length}</p>
      
      <ul style={{ height: '400px', overflow: 'auto' }}>
        {filtered.slice(0, 100).map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត ProductFilter ដែលមាន 1000 products
2. Optimize Counter ដែលមាន slow child component
3. ប្រើ React.memo ជាមួយ list of cards
4. ប្រើ useCallback ក្នុង Todo App
5. Compare performance មុន/ក្រោយ optimization

---

## ✅ សង្ខេប

| Tool | ប្រើ​ពេលណា |
|------|-----------|
| useMemo | Cache expensive value |
| useCallback | Cache function (pass to memo) |
| React.memo | Skip rerender ប្រសិនបើ props ដូច |
| Profile First | Optimize ដោយផ្អែកលើទិន្នន័យ |

➡️ **បន្ទាប់៖** [មេរៀនទី ១៣ - Custom Hooks](./13-custom-hooks.md)
