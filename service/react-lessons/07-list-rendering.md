# 📘 មេរៀនទី ០៧ - List Rendering

## 🎯 គោលដៅមេរៀន
- ប្រើ `.map()` ដើម្បី render lists
- យល់ដឹង `key` prop
- Filter និង Sort lists
- បង្កើត Product List

---

## 1. .map() គឺជាអ្វី?

`.map()` គឺជា array method ដែលបំលែង array មួយទៅ array មួយផ្សេង។

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6]

const names = ["សុខា", "ដាវី"];
const greetings = names.map(name => `សួស្តី ${name}!`);
// ["សួស្តី សុខា!", "សួស្តី ដាវី!"]
```

នៅ React យើងប្រើ `.map()` ដើម្បីបំលែង array of data ទៅ array of JSX elements!

---

## 2. Render List ដំបូង

```jsx
function FruitList() {
  const fruits = ["ស្វាយ", "ក្រូច", "អាប់ផ្លែ", "ផ្លែឆ្មារ"];
  
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

**លទ្ធផល៖**
```
• ស្វាយ
• ក្រូច
• អាប់ផ្លែ
• ផ្លែឆ្មារ
```

---

## 3. Key Prop សំខាន់!

React ត្រូវការ **key** ដើម្បីដឹងថាធាតុណាមួយជាធាតុណា ពេលធ្វើ update។

### ❌ មិនមាន key (Warning)
```jsx
{fruits.map(fruit => <li>{fruit}</li>)}
```

### ✅ មាន key
```jsx
{fruits.map((fruit, index) => <li key={index}>{fruit}</li>)}
```

### 📌 ច្បាប់របស់ Key
1. **Unique** ក្នុង list
2. **Stable** (មិនផ្លាស់ប្តូរពេលរាល់ render)
3. **ល្អបំផុត៖** ប្រើ `id` ពី database
4. **ជម្រើសចុងក្រោយ៖** ប្រើ index

```jsx
// ❌ មិនល្អ - index មិន stable ពេល reorder
{users.map((user, index) => <User key={index} {...user} />)}

// ✅ ល្អ - id stable
{users.map(user => <User key={user.id} {...user} />)}
```

---

## 4. Render Object Array

```jsx
function ProductList() {
  const products = [
    { id: 1, name: "ទូរស័ព្ទ", price: 500 },
    { id: 2, name: "កុំព្យូទ័រ", price: 1200 },
    { id: 3, name: "កាមេរ៉ា", price: 800 }
  ];
  
  return (
    <div>
      <h2>🛍️ ផលិតផល</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong> - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 5. Render Components

```jsx
function ProductCard({ name, price, image }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '5px' }}>
      <img src={image} alt={name} style={{ width: '100px' }} />
      <h3>{name}</h3>
      <p>${price}</p>
      <button>បន្ថែមទៅ Cart</button>
    </div>
  );
}

function App() {
  const products = [
    { id: 1, name: "Product A", price: 100, image: "..." },
    { id: 2, name: "Product B", price: 200, image: "..." },
    { id: 3, name: "Product C", price: 300, image: "..." }
  ];
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
```

---

## 6. Filter & Search

```jsx
import { useState } from 'react';

function SearchableList() {
  const [search, setSearch] = useState("");
  
  const fruits = [
    "ស្វាយ", "ក្រូច", "អាប់ផ្លែ", "ផ្លែឆ្មារ", "ត្នោត", "ឆេរី"
  ];
  
  // Filter
  const filtered = fruits.filter(f => 
    f.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ស្វែងរក..."
      />
      
      <p>មាន {filtered.length} ផ្លែ</p>
      
      <ul>
        {filtered.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      
      {filtered.length === 0 && <p>មិនមានលទ្ធផល</p>}
    </div>
  );
}
```

---

## 7. Sort

```jsx
function SortedProducts() {
  const products = [
    { id: 1, name: "B Product", price: 300 },
    { id: 2, name: "A Product", price: 100 },
    { id: 3, name: "C Product", price: 200 }
  ];
  
  // Sort by price (ascending)
  const sorted = [...products].sort((a, b) => a.price - b.price);
  
  return (
    <ul>
      {sorted.map(p => (
        <li key={p.id}>{p.name} - ${p.price}</li>
      ))}
    </ul>
  );
}
```

⚠️ **ចំណាំ**៖ ប្រើ `[...products].sort()` ដើម្បីមិនកែ array ដើម។

---

## 8. Mini Project: Shopping List

```jsx
import { useState } from 'react';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all, bought, notBought
  
  function addItem() {
    if (!input.trim()) return;
    setItems([...items, {
      id: Date.now(),
      name: input,
      bought: false
    }]);
    setInput("");
  }
  
  function toggleBought(id) {
    setItems(items.map(item =>
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  }
  
  function deleteItem(id) {
    setItems(items.filter(item => item.id !== id));
  }
  
  // Filter
  const visible = items.filter(item => {
    if (filter === "bought") return item.bought;
    if (filter === "notBought") return !item.bought;
    return true;
  });
  
  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h1>🛒 Shopping List</h1>
      
      {/* បន្ថែម */}
      <div>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="បន្ថែមទំនិញ..."
        />
        <button onClick={addItem}>➕</button>
      </div>
      
      {/* Filter */}
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter("all")}>ទាំងអស់</button>
        <button onClick={() => setFilter("notBought")}>មិនទាន់ទិញ</button>
        <button onClick={() => setFilter("bought")}>ទិញរួច</button>
      </div>
      
      {/* List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visible.map(item => (
          <li 
            key={item.id}
            style={{ 
              padding: '10px',
              borderBottom: '1px solid #eee',
              textDecoration: item.bought ? 'line-through' : 'none',
              color: item.bought ? '#999' : '#000'
            }}
          >
            <input 
              type="checkbox" 
              checked={item.bought}
              onChange={() => toggleBought(item.id)}
            />
            {' '}{item.name}
            <button 
              onClick={() => deleteItem(item.id)}
              style={{ float: 'right' }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      
      <p>
        សរុប៖ {items.length} | 
        ទិញរួច៖ {items.filter(i => i.bought).length}
      </p>
    </div>
  );
}
```

---

## 9. Nested Lists

```jsx
function CategoryList() {
  const categories = [
    {
      id: 1,
      name: "ផ្លែឈើ",
      items: ["ស្វាយ", "ក្រូច", "អាប់ផ្លែ"]
    },
    {
      id: 2,
      name: "បន្លែ",
      items: ["ត្រកួន", "ស្ពៃ", "ការ៉ុត"]
    }
  ];
  
  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>
          <h2>{cat.name}</h2>
          <ul>
            {cat.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

## 10. Empty State

```jsx
function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
        <p>📭 មិនទាន់មាន tasks</p>
        <p>ចុចបន្ថែមដើម្បីចាប់ផ្តើម</p>
      </div>
    );
  }
  
  return (
    <ul>
      {tasks.map(task => <li key={task.id}>{task.text}</li>)}
    </ul>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត `<NumberList />` បង្ហាញលេខ 1-100
2. បង្កើត `<UserList />` ជាមួយ search
3. បង្កើត `<ProductGrid />` ដែលអាច sort តាម price
4. បង្កើត Comments list ដែលមាន nested replies
5. បង្កើត Notification List ដែលមាន empty state

---

## ✅ សង្ខេប

| គោលគំនិត | ការប្រើ |
|----------|---------|
| `.map()` | បំលែង array → JSX |
| `key` | Unique identifier |
| `.filter()` | Filter list |
| `.sort()` | Sort list (ប្រើ spread!) |
| Empty state | Handle list ទទេ |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៨ - useEffect](./08-useEffect.md)
