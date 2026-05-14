# 📘 មេរៀនទី ០១ - Components & JSX

## 🎯 គោលដៅមេរៀន
- យល់ដឹងថា Component ជាអ្វី
- សរសេរ Function Component ដំបូង
- ស្គាល់ JSX
- រៀន render component

---

## 1. តើ React ជាអ្វី?

**React** គឺជា **JavaScript Library** សម្រាប់បង្កើត User Interface (UI)។ វាបង្កើតឡើងដោយ **Facebook (Meta)** ហើយត្រូវបានប្រើដោយក្រុមហ៊ុនធំៗដូចជា Netflix, Instagram, Airbnb។

### ហេតុអ្វីត្រូវប្រើ React?
- ✅ **Component-based** - បំបែក UI ជាដុំៗ
- ✅ **Reusable** - ប្រើដុំកូដឡើងវិញបាន
- ✅ **Fast** - ប្រើ Virtual DOM
- ✅ **Community ធំ** - មានអ្នកជំនួយច្រើន

---

## 2. តើ Component ជាអ្វី?

Component គឺជា **ដុំ UI តូចៗ** ដែលផ្គុំជា website មួយ។

### ឧទាហរណ៍ Facebook Page៖
```
┌─────────────────────────┐
│   <Navbar />            │ ← Component ១
├─────────────────────────┤
│   <Sidebar />           │ ← Component ២
│                         │
│   <PostList />          │ ← Component ៣
│                         │
│   <ChatBox />           │ ← Component ៤
└─────────────────────────┘
```

ចែកដុំៗបែបនេះ ងាយស្រួល៖
- **Maintain** (ថែទាំ)
- **Reuse** (ប្រើឡើងវិញ)
- **Test** (សាកល្បង)

---

## 3. Function Component ដំបូង

```jsx
function Hello() {
  return <h1>សួស្តី React!</h1>;
}

export default Hello;
```

### ការពន្យល់បន្ទាត់ៗ
```jsx
function Hello() {        // 1. បង្កើត function ឈ្មោះ Hello
  return <h1>...</h1>;    // 2. ត្រឡប់ JSX (មើលដូច HTML)
}                         //

export default Hello;     // 3. នាំចេញ ដើម្បីឯកសារផ្សេងអាច import
```

### ⚠️ ច្បាប់សំខាន់
| ច្បាប់ | ឧទាហរណ៍ |
|------|---------|
| ឈ្មោះត្រូវចាប់ផ្តើមដោយអក្សរធំ | ✅ `Hello` ❌ `hello` |
| ត្រូវ return JSX | ✅ `return <h1>...</h1>` |
| ប្រើ PascalCase | ✅ `MyButton` ❌ `mybutton` |

---

## 4. JSX ជាអ្វី?

**JSX** = **JavaScript** + **XML/HTML**

```jsx
const element = <h1>នេះជា JSX</h1>;
```

JSX ត្រូវបានបំលែងទៅជា JavaScript ធម្មតាដោយ **Babel**៖
```js
// JSX
const element = <h1>Hello</h1>;

// បំលែងទៅជា
const element = React.createElement('h1', null, 'Hello');
```

---

## 5. Render Component

```jsx
// Hello.jsx
function Hello() {
  return <h1>សួស្តី!</h1>;
}
export default Hello;

// App.jsx
import Hello from './Hello';

function App() {
  return (
    <div>
      <Hello />
      <Hello />
      <Hello />
    </div>
  );
}
export default App;
```

**លទ្ធផល៖**
```
សួស្តី!
សួស្តី!
សួស្តី!
```

👉 Component អាចហៅប្រើឡើងវិញបានគ្មានកំណត់!

---

## 6. ឧទាហរណ៍ ៥ យ៉ាង (Practice Examples)

### Example 1: Profile Card
```jsx
function ProfileCard() {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      borderRadius: '8px',
      maxWidth: '300px'
    }}>
      <h2>សុខា ដាវី</h2>
      <p>📍 ភ្នំពេញ កម្ពុជា</p>
      <p>💼 Web Developer</p>
      <p>📧 sokha@example.com</p>
    </div>
  );
}
```

### Example 2: Welcome Banner
```jsx
function WelcomeBanner() {
  const today = new Date().toLocaleDateString('km-KH');
  
  return (
    <div>
      <h1>🎉 សូមស្វាគមន៍!</h1>
      <p>ថ្ងៃនេះ៖ {today}</p>
    </div>
  );
}
```

### Example 3: Product Card
```jsx
function ProductCard() {
  const product = {
    name: "ទូរស័ព្ទ iPhone 15",
    price: 1200,
    inStock: true
  };
  
  return (
    <div>
      <h2>{product.name}</h2>
      <p>តម្លៃ៖ ${product.price}</p>
      <p>ស្តុក៖ {product.inStock ? "✅ មាន" : "❌ អស់"}</p>
    </div>
  );
}
```

### Example 4: Math Display
```jsx
function MathDisplay() {
  const a = 10;
  const b = 5;
  
  return (
    <div>
      <h2>គណនា</h2>
      <p>{a} + {b} = {a + b}</p>
      <p>{a} - {b} = {a - b}</p>
      <p>{a} × {b} = {a * b}</p>
      <p>{a} ÷ {b} = {a / b}</p>
    </div>
  );
}
```

### Example 5: Multiple Components
```jsx
function Header() {
  return <h1>🌐 គេហទំព័ររបស់ខ្ញុំ</h1>;
}

function Content() {
  return <p>នេះជាមាតិកាសំខាន់របស់ website</p>;
}

function Footer() {
  return <footer>© 2026 KouPreng</footer>;
}

function App() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

---

## 📝 លំហាត់ (Exercises)

1. បង្កើត `<MyCard />` ដែលបង្ហាញឈ្មោះ និងមុខរបររបស់អ្នក
2. បង្កើត 3 components: `Header`, `Body`, `Footer` ហើយដាក់ក្នុង `App`
3. បង្កើត component គណនាផ្ទៃក្រឡាចតុកោណ
4. បង្កើត `BookCard` បង្ហាញ title, author, year ដោយប្រើ object
5. បង្កើត `Greeting` បង្ហាញ "Good Morning/Afternoon/Evening" ផ្អែកលើម៉ោង

---

## ✅ សង្ខេប

- Component = function ដែល return JSX
- ឈ្មោះត្រូវចាប់ផ្តើមដោយអក្សរធំ
- JSX មើលដូច HTML ប៉ុន្តែជា JavaScript
- Component អាចហៅឡើងវិញបានច្រើនដង

➡️ **បន្ទាប់៖** [មេរៀនទី ០២ - JSX លម្អិត](./02-jsx-deep-dive.md)
