# 📘 មេរៀនទី ០២ - JSX លម្អិត

## 🎯 គោលដៅមេរៀន
- ស្គាល់ JSX syntax លម្អិត
- ស្វែងយល់ self-closing tags
- ប្រើ Fragments
- ដាក់ JavaScript ក្នុង JSX

---

## 1. JSX Syntax Rules

### ច្បាប់ទី ១៖ ត្រូវមាន Parent Element តែ ១

```jsx
// ❌ ខុស - មាន 2 root elements
function Wrong() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ ត្រឹមត្រូវ - រុំដោយ <div>
function Right() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}
```

### ច្បាប់ទី ២៖ Self-Closing Tags

នៅ HTML អ្នកអាចសរសេរ `<img>` បាន ប៉ុន្តែ JSX តម្រូវឱ្យបិទ៖

```jsx
// ❌ ខុស
<img src="photo.jpg">
<br>
<input type="text">
<hr>

// ✅ ត្រឹមត្រូវ
<img src="photo.jpg" />
<br />
<input type="text" />
<hr />
```

### ច្បាប់ទី ៣៖ ប្រើ camelCase សម្រាប់ Attributes

```jsx
// HTML        →  JSX
class       →  className
for         →  htmlFor
onclick     →  onClick
onchange    →  onChange
tabindex    →  tabIndex
maxlength   →  maxLength
```

### ឧទាហរណ៍៖
```jsx
// ❌ ខុស
<div class="container">
  <label for="name">ឈ្មោះ</label>
  <input onclick="handleClick()" />
</div>

// ✅ ត្រឹមត្រូវ
<div className="container">
  <label htmlFor="name">ឈ្មោះ</label>
  <input onClick={handleClick} />
</div>
```

---

## 2. Fragments (`<>...</>`)

ពេលខ្លះអ្នកមិនចង់បន្ថែម `<div>` ដែលគ្មានន័យ។ ប្រើ **Fragment** ជំនួស៖

```jsx
// ❌ បន្ថែម <div> ដែលមិនចាំបាច់
function List() {
  return (
    <div>
      <li>ផ្លែអាប់ផ្លែ</li>
      <li>ផ្លែស្វាយ</li>
      <li>ផ្លែក្រូច</li>
    </div>
  );
}

// ✅ ប្រើ Fragment
function List() {
  return (
    <>
      <li>ផ្លែអាប់ផ្លែ</li>
      <li>ផ្លែស្វាយ</li>
      <li>ផ្លែក្រូច</li>
    </>
  );
}

// ✅ ឬប្រើ Fragment វែង (ត្រូវការ key)
function List() {
  return (
    <React.Fragment>
      <li>ផ្លែអាប់ផ្លែ</li>
      <li>ផ្លែស្វាយ</li>
    </React.Fragment>
  );
}
```

---

## 3. ដាក់ JavaScript ក្នុង JSX (`{ }`)

ប្រើ `{ }` ដើម្បីបញ្ចូល JavaScript expression៖

```jsx
function Greeting() {
  const name = "សុខា";
  const age = 20;
  const isStudent = true;
  
  return (
    <div>
      {/* បង្ហាញ variable */}
      <h1>សួស្តី, {name}!</h1>
      
      {/* គណនា */}
      <p>អាយុ៖ {age} ឆ្នាំ</p>
      <p>ឆ្នាំក្រោយ៖ {age + 1} ឆ្នាំ</p>
      
      {/* Function call */}
      <p>ឈ្មោះធំ៖ {name.toUpperCase()}</p>
      
      {/* Ternary operator */}
      <p>{isStudent ? "សិស្ស" : "មិនមែនសិស្ស"}</p>
      
      {/* Date */}
      <p>ថ្ងៃនេះ៖ {new Date().toLocaleDateString('km-KH')}</p>
    </div>
  );
}
```

### ⚠️ ច្បាប់ការប្រើ `{ }`
```jsx
// ✅ Expression ដែលប្រើបាន
{variable}
{1 + 2}
{user.name}
{getName()}
{condition ? 'A' : 'B'}
{array.map(...)}

// ❌ Statement ប្រើមិនបាន
{if (condition) { ... }}        // ខុស
{for (let i = 0; i < 10; i++)}  // ខុស
```

---

## 4. Inline Styles

```jsx
function StyledBox() {
  // Style ជា object
  const boxStyle = {
    backgroundColor: 'lightblue',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '18px'
  };
  
  return (
    <div style={boxStyle}>
      <p>នេះជា styled box</p>
    </div>
  );
}

// ឬសរសេរផ្ទាល់
function InlineStyled() {
  return (
    <div style={{ color: 'red', fontWeight: 'bold' }}>
      អក្សរក្រហម
    </div>
  );
}
```

### ⚠️ ចំណាំ៖
- CSS properties ប្រើ **camelCase**៖ `background-color` → `backgroundColor`
- Values ប្រើ string៖ `padding: '20px'` (មិនមែន `20px` ទេ)
- ត្រូវការ `{{ }}` ពីរស្រទាប់ (ស្រទាប់ខាងក្រៅជា JSX, ខាងក្នុងជា object)

---

## 5. Comments ក្នុង JSX

```jsx
function Example() {
  return (
    <div>
      {/* នេះជា comment ក្នុង JSX */}
      <h1>Title</h1>
      
      {/* 
        Comment ច្រើនបន្ទាត់
        ក៏ប្រើបានដែរ
      */}
      <p>Paragraph</p>
    </div>
  );
}
```

---

## 6. ឧទាហរណ៍ពេញលេញ

```jsx
function UserProfile() {
  const user = {
    name: "សុខា ដាវី",
    age: 25,
    avatar: "https://i.pravatar.cc/150",
    skills: ["React", "JavaScript", "CSS"],
    isOnline: true
  };
  
  return (
    <>
      {/* Header */}
      <header style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
        <h1>👤 Profile</h1>
      </header>
      
      {/* Body */}
      <main style={{ padding: '20px' }}>
        <img 
          src={user.avatar} 
          alt={user.name}
          style={{ borderRadius: '50%', width: '100px' }}
        />
        <h2>{user.name}</h2>
        <p>អាយុ៖ {user.age} ឆ្នាំ</p>
        <p>ស្ថានភាព៖ {user.isOnline ? '🟢 Online' : '🔴 Offline'}</p>
        <p>ជំនាញ៖ {user.skills.join(', ')}</p>
      </main>
      
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '10px' }}>
        <small>© 2026</small>
      </footer>
    </>
  );
}
```

---

## 📝 លំហាត់

1. បង្កើត `BusinessCard` component ប្រើ Fragment
2. បង្កើត `<RandomNumber />` ដែលបង្ហាញលេខ random
3. បង្កើត `<Calculator />` ដែលបង្ហាញលទ្ធផល math operations ៥ យ៉ាង
4. បង្កើត `<StyledHeader />` ដែលប្រើ inline styles
5. បង្កើត profile page ដែលរួមបញ្ចូលរូបភាព ឈ្មោះ និងជំនាញ

---

## ✅ សង្ខេប

| គោលគំនិត | ការប្រើ |
|----------|---------|
| Parent element | ត្រូវតែមួយ |
| Self-closing | `<img />`, `<br />` |
| className | ជំនួស `class` |
| Fragment | `<>...</>` ឬ `<React.Fragment>` |
| `{ }` | ដាក់ JavaScript |
| Inline style | `style={{ }}` |
| Comment | `{/* ... */}` |

➡️ **បន្ទាប់៖** [មេរៀនទី ០៣ - Props](./03-props.md)
