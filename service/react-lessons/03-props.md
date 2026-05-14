# 📘 មេរៀនទី ០៣ - Props

## 🎯 គោលដៅមេរៀន
- យល់ដឹង Parent vs Child Component
- រៀនបញ្ជូន props (string, number, object, array, function)
- ស្គាល់ Destructuring props
- ប្រើ Default props
- ប្រើ children prop

---

## 1. Props ជាអ្វី?

**Props** = **Properties** (លក្ខណៈ)

Props គឺជា **ទិន្នន័យ** ដែល **Parent component** បញ្ជូនទៅ **Child component**។

### ប្រៀបធៀបជាមួយជីវិតពិត
ប្រសិនបើ Component ជា **មុខម្ហូប** នោះ Props គឺជា **គ្រឿងផ្សំ**៖
- `<Pizza topping="cheese" size="large" />`
- `<Pizza topping="pepperoni" size="medium" />`

ដូចគ្នា គ្រឿងផ្សំខុសគ្នា ផ្តល់លទ្ធផលខុសគ្នា!

---

## 2. Parent → Child

### Parent Component
```jsx
function App() {
  return (
    <div>
      <Greeting name="សុខា" />
      <Greeting name="ដាវី" />
      <Greeting name="វណ្ណា" />
    </div>
  );
}
```

### Child Component
```jsx
function Greeting(props) {
  return <h1>សួស្តី, {props.name}!</h1>;
}
```

**លទ្ធផល៖**
```
សួស្តី, សុខា!
សួស្តី, ដាវី!
សួស្តី, វណ្ណា!
```

👉 Component តែ ១ ប៉ុន្តែប្រើបានច្រើនកន្លែង ដោយផ្លាស់ប្តូរ props!

---

## 3. Destructuring Props

ជំនួស `props.name` យើងអាច **destructure** បាន៖

```jsx
// មុន
function Greeting(props) {
  return <h1>សួស្តី, {props.name}!</h1>;
}

// ក្រោយ (ល្អជាង)
function Greeting({ name }) {
  return <h1>សួស្តី, {name}!</h1>;
}

// មាន props ច្រើន
function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>អាយុ៖ {age}</p>
      <p>អ៊ីមែល៖ {email}</p>
    </div>
  );
}
```

---

## 4. ប្រភេទ Props ផ្សេងៗ

### 4.1 String Props
```jsx
<User name="សុខា" />

function User({ name }) {
  return <p>{name}</p>;
}
```

### 4.2 Number Props
```jsx
<Counter count={10} />        // {} សម្រាប់ number

function Counter({ count }) {
  return <p>ចំនួន៖ {count}</p>;
}
```

### 4.3 Boolean Props
```jsx
<Button disabled={true} />
<Button disabled />            // ដូចគ្នានឹង disabled={true}

function Button({ disabled }) {
  return <button disabled={disabled}>Click</button>;
}
```

### 4.4 Object Props
```jsx
const user = {
  name: "សុខា",
  age: 25,
  email: "sokha@email.com"
};

<UserCard user={user} />

function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.age}</p>
      <p>{user.email}</p>
    </div>
  );
}
```

### 4.5 Array Props
```jsx
const fruits = ["ស្វាយ", "ក្រូច", "អាប់ផ្លែ"];

<FruitList fruits={fruits} />

function FruitList({ fruits }) {
  return (
    <ul>
      {fruits.map((fruit, i) => <li key={i}>{fruit}</li>)}
    </ul>
  );
}
```

### 4.6 Function Props
```jsx
function App() {
  const handleClick = () => {
    alert("ចុចហើយ!");
  };
  
  return <Button onClick={handleClick} />;
}

function Button({ onClick }) {
  return <button onClick={onClick}>ចុចខ្ញុំ</button>;
}
```

### 4.7 JSX Props
```jsx
<Card>
  <h1>Title</h1>
  <p>Content</p>
</Card>

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
```

---

## 5. Default Props

```jsx
function Greeting({ name = "មិត្ត", age = 0 }) {
  return (
    <div>
      <h1>សួស្តី, {name}!</h1>
      <p>អាយុ៖ {age}</p>
    </div>
  );
}

// ប្រើដោយគ្មាន props
<Greeting />              // សួស្តី, មិត្ត! អាយុ៖ 0

// ប្រើជាមួយ props
<Greeting name="សុខា" />   // សួស្តី, សុខា! អាយុ៖ 0
<Greeting name="ដាវី" age={25} />  // សួស្តី, ដាវី! អាយុ៖ 25
```

---

## 6. Spread Props

```jsx
const user = {
  name: "សុខា",
  age: 25,
  email: "sokha@email.com"
};

// មុន
<UserCard name={user.name} age={user.age} email={user.email} />

// ក្រោយ (ខ្លីជាង)
<UserCard {...user} />

function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age} | {email}</p>
    </div>
  );
}
```

---

## 7. Children Prop

```jsx
function Card({ children, title }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// ប្រើ
function App() {
  return (
    <Card title="ព័ត៌មាន">
      <p>នេះជាមាតិកា</p>
      <button>ចុច</button>
    </Card>
  );
}
```

`children` ជា **special prop** ដែលរក្សាទុក content នៅចន្លោះ tag។

---

## 8. មិនអាចផ្លាស់ប្តូរ Props (Read-Only)

```jsx
function Greeting({ name }) {
  // ❌ ខុស! មិនត្រូវផ្លាស់ប្តូរ props
  name = "ផ្លាស់ប្តូរ";
  
  return <h1>{name}</h1>;
}
```

**Props ត្រូវការការ flow** ពី Parent → Child តែប៉ុណ្ណោះ!

---

## 9. Mini Project: User List

```jsx
// UserCard.jsx
function UserCard({ name, age, role, avatar }) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '15px', 
      margin: '10px',
      borderRadius: '8px',
      maxWidth: '250px'
    }}>
      <img 
        src={avatar} 
        alt={name}
        style={{ width: '80px', borderRadius: '50%' }}
      />
      <h3>{name}</h3>
      <p>អាយុ៖ {age}</p>
      <p>តួនាទី៖ {role}</p>
    </div>
  );
}

// App.jsx
function App() {
  const users = [
    { id: 1, name: "សុខា", age: 25, role: "Developer", avatar: "https://i.pravatar.cc/80?img=1" },
    { id: 2, name: "ដាវី", age: 28, role: "Designer", avatar: "https://i.pravatar.cc/80?img=2" },
    { id: 3, name: "វណ្ណា", age: 30, role: "Manager", avatar: "https://i.pravatar.cc/80?img=3" }
  ];
  
  return (
    <div>
      <h1>👥 បញ្ជីសមាជិក</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {users.map(user => (
          <UserCard key={user.id} {...user} />
        ))}
      </div>
    </div>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត `<Button>` component ដែលទទួល `text`, `color`, និង `onClick`
2. បង្កើត `<ProductCard>` ទទួល `name`, `price`, `image`
3. បង្កើត `<Layout>` ប្រើ `children` រួមជាមួយ Header និង Footer
4. បង្កើត `<Avatar>` ដែលមាន default image ប្រសិនបើគ្មាន prop
5. បង្កើត Mini Project: បង្ហាញ list of products ដោយប្រើ `ProductCard`

---

## ✅ សង្ខេប

| គោលគំនិត | ការពន្យល់ |
|----------|----------|
| Props | ទិន្នន័យ Parent → Child |
| Destructuring | `{ name }` ជំនួស `props.name` |
| Default props | `{ name = "default" }` |
| Spread props | `<Comp {...obj} />` |
| children | content ចន្លោះ tag |
| Read-only | មិនត្រូវផ្លាស់ប្តូរ props |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៤ - useState](./04-useState.md)
