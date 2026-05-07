What is React JSX?
What is React?
React is a JavaScript library made by Facebook for building user interfaces. It lets you break your UI into small, reusable pieces called components. Instead of manually updating the DOM, you describe what the UI should look like, and React handles the updates.

What is JSX?
JSX (JavaScript XML) is a syntax extension that lets you write HTML-like code inside JavaScript. It is not valid HTML — it compiles to React.createElement() calls.

// JSX you write:
const el = <h1 className="title">Hello World</h1>;

// What it compiles to:
const el = React.createElement("h1", { className: "title" }, "Hello World");
JSX is optional but almost everyone uses it. Without JSX, React code becomes hard to read very quickly.
How React updates the UI
// The core idea:
UI = f(state)

// Same state → always same output
// Change state → React re-renders automatically
React keeps a Virtual DOM (a JS copy of the real DOM). When state changes, React computes the difference and only updates the parts of the real DOM that changed.

A minimal React app
import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return <h1>Hello World!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
JSX rules — quick reference
One root element
className not class
camelCase events
self-close empty tags
{} for JS expressions


=================
Card components
What is a component?
A component is a reusable JavaScript function that returns JSX. Component names must start with a capital letter. Think of it as a custom HTML element you define yourself.

function Card() {
  return (
    <div>
      <h2>Product Name</h2>
      <p>Description here</p>
    </div>
  );
}
Using a component
function App() {
  return (
    <div>
      <Card />
      <Card />
      <Card />
    </div>
  );
}
Writing <Card /> calls the Card function and renders its JSX. You can reuse it as many times as you want.
Component file structure (best practice)
// Card.jsx
function Card() {
  return <div className="card">...</div>;
}

export default Card;

// App.jsx
import Card from "./Card";

function App() {
  return <Card />;
}
export default App;
Fragment — avoid extra divs
Adds unwanted div
return (
  <div>
    <h1>Hi</h1>
    <p>Text</p>
  </div>
);
No extra DOM node
return (
  <>
    <h1>Hi</h1>
    <p>Text</p>
  </>
);
=======================
Adding CSS styles
Method 1 — external CSS file
// Card.css
.card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

// Card.jsx
import "./Card.css";

function Card() {
  return <div className="card">Content</div>;
}
Use className not class — class is a reserved word in JavaScript.
Method 2 — inline styles (object)
function Card() {
  const styles = {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",  // camelCase!
    fontSize: 16,         // px is default for numbers
  };

  return <div style={styles}>Content</div>;
}
CSS property names become camelCase in JavaScript: background-color → backgroundColor, font-size → fontSize.
Method 3 — inline object directly
<div style={{ color: "red", fontSize: 20 }}>
  Text
</div>
Double braces: outer {} = JSX expression, inner {} = JavaScript object literal.
Dynamic className
function Button({ primary }) {
  return (
    <button className={primary ? "btn btn-primary" : "btn"}>
      Click me
    </button>
  );
}
CSS Modules (scoped styles)
// Card.module.css
.card { padding: 1rem; }

// Card.jsx
import styles from "./Card.module.css";

function Card() {
  return <div className={styles.card}>Content</div>;
}
CSS Modules generate unique class names automatically — no naming conflicts between components.
=======================
Props
What are props?
Props (properties) are how a parent component passes data to a child component. They are read-only inside the child — the child cannot modify them.

// Parent passes data:
<Card name="Bro Code" age={36} email="bro@code.com" />

// Child receives via props parameter:
function Card(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>{props.email}</p>
    </div>
  );
}
Destructuring props (cleaner)
function Card({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>{email}</p>
    </div>
  );
}
Default props (React 19+ approach)
// defaultProps deprecated in React 19+
// Use default parameter values instead:

function Card({ name = "Guest", age = 0, email = "N/A" }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}
Prop types
// Strings:       name="Bro"
// Numbers:       age={36}         (must use {})
// Booleans:      active={true}    or just: active
// Arrays:        items={[1,2,3]}
// Objects:       data={{ id:1 }}
// Functions:     onClick={fn}
// JSX:           icon={<Icon />}
children prop
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage — anything inside the tags becomes children:
<Card>
  <h2>Title</h2>
  <p>Some text here</p>
</Card>
=======================
Conditional rendering
Ternary operator
function UserGreeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn
        ? <h1>Welcome back!</h1>
        : <h1>Please log in</h1>
      }
    </div>
  );
}
Ternary: condition ? render-if-true : render-if-false. Use when you need an either/or.
Logical AND (&&)
function Notification({ message }) {
  return (
    <div>
      {message && <p className="notification">{message}</p>}
    </div>
  );
}
Use && when you only want to show something if a condition is true, and show nothing otherwise. Warning: if message is 0 (number), it renders "0" — use message !== "" instead.
If/else — early return (cleanest for complex logic)
function UserStatus({ isLoggedIn, isAdmin }) {
  if (!isLoggedIn) return <p>Not logged in</p>;
  if (isAdmin) return <p>Welcome, Admin!</p>;
  return <p>Welcome, User!</p>;
}
Conditional CSS class
function Button({ disabled }) {
  return (
    <button
      className={disabled ? "btn btn-disabled" : "btn"}
      disabled={disabled}
    >
      Submit
    </button>
  );
}
Rendering null (show nothing)
function Banner({ show }) {
  if (!show) return null; // renders nothing, no DOM node

  return <div className="banner">Important message!</div>;
}
=======================
Click events
Basic click handler
function Button() {
  function handleClick() {
    alert("Button was clicked!");
  }

  return <button onClick={handleClick}>Click me</button>;
}
Pass the function reference — not a call. onClick={handleClick} is correct. onClick={handleClick()} runs immediately on render.
Passing arguments
function FoodList() {
  function handleOrder(food) {
    alert("You ordered: " + food);
  }

  return (
    <div>
      <button onClick={() => handleOrder("Pizza")}>Pizza</button>
      <button onClick={() => handleOrder("Burger")}>Burger</button>
    </div>
  );
}
Use an arrow function wrapper when you need to pass arguments. The wrapper is called by React, then calls your handler with the argument.
The event object (e)
function Form() {
  function handleSubmit(e) {
    e.preventDefault(); // stops page refresh
    console.log("Submitted!");
  }

  function handleInput(e) {
    console.log(e.target.value); // the typed text
    console.log(e.target.name);  // the input's name
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleInput} />
      <button type="submit">Submit</button>
    </form>
  );
}
Common events
onClick       // button, div, any element
onDoubleClick // double click
onMouseEnter  // hover in
onMouseLeave  // hover out
onChange      // input, select, textarea
onSubmit      // form
onKeyDown     // key pressed
onFocus       // element focused
onBlur        // element loses focus
=======================
useState hook
What is a hook?
Hooks are special functions that let you "hook into" React features inside function components. They always start with use. The most important one is useState.

useState syntax
import { useState } from "react";

const [value, setValue] = useState(initialValue);
//     ^         ^                  ^
//  current   updater function   starting value
Counter example
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    setCount(count - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
State with different types
const [count, setCount]       = useState(0);       // number
const [name, setName]         = useState("");      // string
const [active, setActive]     = useState(false);   // boolean
const [items, setItems]       = useState([]);      // array
const [user, setUser]         = useState(null);    // null/object
Rules of hooks
// 1. Only call hooks at the TOP level of a component
// 2. Never call hooks inside conditions, loops, or nested functions

// WRONG:
if (someCondition) {
  const [x, setX] = useState(0); // breaks!
}

// CORRECT:
const [x, setX] = useState(0); // always at top level
=======================
nChange event handler
What is a controlled input?
A controlled input is one where React state is the single source of truth for the input's value. Every keystroke updates state, and state updates the displayed value.

function NameForm() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={name}                          // state → DOM
        onChange={(e) => setName(e.target.value)} // DOM → state
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
Handling multiple inputs
function SignupForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value // computed property key
    }));
  }

  return (
    <form>
      <input name="username" value={form.username} onChange={handleChange} />
      <input name="email"    value={form.email}    onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} type="password" />
    </form>
  );
}
[e.target.name] is a computed property key — it uses the input's name attribute as the key to update in the object. One handler for all inputs.
Select and textarea
// Select:
<select value={color} onChange={(e) => setColor(e.target.value)}>
  <option value="red">Red</option>
  <option value="blue">Blue</option>
</select>

// Textarea:
<textarea value={text} onChange={(e) => setText(e.target.value)} />
=======================
Color picker app
What we're building
A simple app that lets the user type a color name or hex value and the background of a box updates in real time. It combines onChange, useState, and inline styles.

Full code
import { useState } from "react";

function ColorPicker() {
  const [color, setColor] = useState("#ffffff");

  function handleChange(e) {
    setColor(e.target.value);
  }

  return (
    <div>
      <h1>Color Picker</h1>

      <div
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: color,
          border: "1px solid #ccc",
          margin: "1rem 0",
        }}
      />

      <label>Pick a color: </label>
      <input
        type="color"
        value={color}
        onChange={handleChange}
      />

      <p>Selected: {color}</p>
    </div>
  );
}
Key concepts demonstrated
useState for color value
onChange updates state
inline style reads from state
real-time UI update
=======================
Updater functions
The problem with direct updates
// React may BATCH multiple setState calls.
// This means both calls read the SAME "count":
setCount(count + 1);
setCount(count + 1);
// Result: count only goes up by 1, not 2!
Updater function — reads latest value
// Pass a function instead of a value:
setCount(prevCount => prevCount + 1);
setCount(prevCount => prevCount + 1);
// Result: count goes up by 2 correctly!
The updater function receives the most recent state value as its argument, even when React batches updates. Use this pattern whenever the new state depends on the previous state.
Practical example
function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    // Each updater sees the result of the previous one:
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // count increases by 3
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={addThree}>+3</button>
    </div>
  );
}
When to use updater functions
Direct value (OK for simple cases)
setCount(count + 1);
setName("Bro");
setActive(false);
Updater (required when depending on prev)
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);
setActive(prev => !prev);
=======================
Update objects in state
Why you cannot mutate
React uses reference equality to detect state changes. If you mutate an object directly, the reference stays the same, and React won't re-render.

WRONG — mutating state
car.year = 2024;
setCar(car); // same reference!
// React sees no change → no re-render
CORRECT — new object
setCar(prev => ({
  ...prev,    // copy all old fields
  year: 2024  // override just this one
}));
Spread operator to update one field
function CarInfo() {
  const [car, setCar] = useState({
    make: "Toyota",
    model: "Supra",
    year: 2023,
    color: "black"
  });

  function updateYear() {
    setCar(prevCar => ({ ...prevCar, year: 2024 }));
  }

  function updateColor(e) {
    setCar(prevCar => ({ ...prevCar, color: e.target.value }));
  }

  return (
    <div>
      <p>{car.year} {car.make} {car.model}</p>
      <p>Color: {car.color}</p>
      <button onClick={updateYear}>Update year</button>
      <input value={car.color} onChange={updateColor} />
    </div>
  );
}
The spread operator explained
const original = { a: 1, b: 2, c: 3 };

// ...original copies all fields:
const updated = { ...original, b: 99 };
// Result: { a: 1, b: 99, c: 3 }
// Later keys override earlier ones!
=======================
pdate arrays in state
Never mutate arrays directly
// These MUTATE the array — never use in React state:
arr.push(item);    // adds to end
arr.pop();         // removes from end
arr.splice(i, 1);  // removes at index
arr.sort();        // sorts in place

// These return NEW arrays — use these:
[...arr, item]          // add to end
arr.filter(x => x)     // remove items
arr.map(x => ...)       // transform items
[...arr].sort(...)      // sort a copy
Add an item
const [fruits, setFruits] = useState(["Apple", "Banana"]);

function addFruit() {
  setFruits(prev => [...prev, "Cherry"]);
}
Remove an item
function removeFruit(fruitToRemove) {
  setFruits(prev => prev.filter(f => f !== fruitToRemove));
}
Full list example
function FruitList() {
  const [fruits, setFruits] = useState(["Apple","Banana","Cherry"]);
  const [input, setInput] = useState("");

  function addFruit() {
    if (input.trim() === "") return;
    setFruits(prev => [...prev, input]);
    setInput("");
  }

  function removeFruit(name) {
    setFruits(prev => prev.filter(f => f !== name));
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addFruit}>Add</button>
      <ul>
        {fruits.map(f => (
          <li key={f}>
            {f}
            <button onClick={() => removeFruit(f)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
=======================
Update array of objects in state
Setup
const [cars, setCars] = useState([
  { id: 1, make: "Toyota", model: "Corolla", year: 2020 },
  { id: 2, make: "Honda",  model: "Civic",   year: 2021 },
  { id: 3, make: "Ford",   model: "Mustang",  year: 2022 },
]);
Add an object
function addCar() {
  const newCar = { id: Date.now(), make: "BMW", model: "M3", year: 2024 };
  setCars(prev => [...prev, newCar]);
}
Remove an object by id
function removeCar(id) {
  setCars(prev => prev.filter(car => car.id !== id));
}
Update one field of one object
function updateYear(id, newYear) {
  setCars(prev => prev.map(car =>
    car.id === id
      ? { ...car, year: newYear }  // update this one
      : car                         // leave others unchanged
  ));
}
.map() returns a new array. For the matching item, spread the old object and override the field. For all others, return them unchanged.
Rendering with controls
return (
  <div>
    {cars.map(car => (
      <div key={car.id}>
        <p>{car.year} {car.make} {car.model}</p>
        <button onClick={() => removeCar(car.id)}>Remove</button>
      </div>
    ))}
    <button onClick={addCar}>Add car</button>
  </div>
);
=======================
To-do list app
What we're building
A full to-do list that combines: controlled input, add item, remove item, toggle complete — all in one component using useState.

Full code
import { useState } from "react";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  function addTask() {
    if (input.trim() === "") return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: input, done: false }
    ]);
    setInput("");
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addTask();
  }

  return (
    <div>
      <h1>To-Do List</h1>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a task..."
      />
      <button onClick={addTask}>Add</button>

      <ol>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{ textDecoration: task.done ? "line-through" : "none" }}
          >
            <span onClick={() => toggleTask(task.id)}>
              {task.text}
            </span>
            <button onClick={() => removeTask(task.id)}>X</button>
          </li>
        ))}
      </ol>

      <p>{tasks.filter(t => !t.done).length} tasks remaining</p>
    </div>
  );
}
=======================
useEffect hook
What is useEffect?
useEffect lets you run side effects after a component renders. Side effects are things that interact outside of the component: fetching data, setting up timers, updating the document title, event listeners.

Syntax
import { useEffect } from "react";

useEffect(() => {
  // code to run after render
}, [dependencies]);
The dependency array controls when it runs
useEffect(() => {
  // Runs after EVERY render
});

useEffect(() => {
  // Runs ONCE on mount (component first appears)
}, []);

useEffect(() => {
  // Runs when 'count' changes
}, [count]);

useEffect(() => {
  // Runs when 'name' OR 'age' changes
}, [name, age]);
Cleanup function
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);

  // Return a cleanup function:
  // Runs before the next effect OR when component unmounts
  return () => clearInterval(timer);
}, []);
The cleanup function prevents memory leaks. Always clean up timers, subscriptions, and event listeners.
Fetching data with useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/users/" + userId)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // re-fetch whenever userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
=======================
Digital clock app
Concepts used
useState for time
useEffect with setInterval
cleanup on unmount
Date API
Full code
import { useState, useEffect } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // cleanup!
  }, []); // empty array = run once on mount

  function formatTime(date) {
    let hours   = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm  = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  return (
    <div className="clock">
      <h1>{formatTime(time)}</h1>
    </div>
  );
}
Why cleanup matters here
If the component unmounts (disappears from screen) without clearing the interval, the interval keeps firing and tries to call setTime on an unmounted component — causing a memory leak and React warning.
=======================
useContext hook
The problem — prop drilling
Prop drilling is when you pass data through many layers of components just to reach a deeply nested child. Context solves this — any component can access context directly, without props being passed down.

// Prop drilling (annoying):
<App theme={theme}>
  <Layout theme={theme}>
    <Header theme={theme}>
      <Button theme={theme}> // only this needed it!
Step 1 — create a context
// ThemeContext.js
import { createContext } from "react";

const ThemeContext = createContext();

export default ThemeContext;
Step 2 — provide the context
// App.jsx
import ThemeContext from "./ThemeContext";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}
Any component inside the Provider can access the value, no matter how deeply nested.
Step 3 — consume the context
// Button.jsx — deep inside the tree
import { useContext } from "react";
import ThemeContext from "./ThemeContext";

function Button() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      style={{ background: theme === "dark" ? "#333" : "#fff" }}
      onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
    >
      Toggle theme
    </button>
  );
}
=======================
useRef hook
What is useRef?
useRef creates a mutable object that persists across renders. It has two main uses: (1) directly accessing a DOM element, (2) storing a value that should NOT trigger a re-render when changed.

import { useRef } from "react";

const myRef = useRef(initialValue);
// Access the value:  myRef.current
// Change the value:  myRef.current = newValue (no re-render!)
Use 1 — accessing a DOM element
function TextInput() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus(); // directly access the DOM node
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus the input</button>
    </div>
  );
}
Use 2 — storing a value without re-render
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null); // stores interval ID

  function start() {
    intervalRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
Storing the interval ID in a ref (not state) means updating it doesn't re-render the component — which would break the timer.
useState vs useRef
// useState:
// - changing value triggers re-render
// - value readable in JSX directly

// useRef:
// - changing .current does NOT re-render
// - must read .current to get value
// - useful for: DOM access, timers, previous values
=======================
Stopwatch app
Concepts combined
useState for elapsed time
useRef for interval ID
useEffect for cleanup
date formatting
Full code
import { useState, useEffect, useRef } from "react";

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      // Record when we started (adjusting for already-elapsed time)
      startTimeRef.current = Date.now() - elapsedTime;

      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10); // update every 10ms for smooth display
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  function start()  { setIsRunning(true); }
  function stop()   { setIsRunning(false); }
  function reset()  {
    setIsRunning(false);
    setElapsedTime(0);
  }

  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, "0");
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
    return `${minutes}:${seconds}.${centiseconds}`;
  }

  return (
    <div className="stopwatch">
      <h1>Stopwatch</h1>
      <p className="display">{formatTime(elapsedTime)}</p>

      <button onClick={start}  disabled={isRunning}>Start</button>
      <button onClick={stop}   disabled={!isRunning}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
Why useRef for the interval, not useState?
If we stored the interval ID in state, calling setIntervalId(...) would trigger a re-render, which would re-run the useEffect, which would create another interval — an infinite loop. useRef stores the ID silently with no re-render side effect.

Course summary — what you've learned
JSX syntax
Components
Props
Conditional rendering
Lists & keys
Events
useState
Controlled inputs
Updater functions
Object/array state
useEffect
useContext
useRef
Next topics beyond this course: useReducer, custom hooks, React Router, data fetching libraries (React Query, SWR), state management (Zustand, Redux).
=======================
Let's refine and extend the material with tighter structure, deeper technical detail, and clearer conceptual separation.
React & JavaScript Core Patterns

This section focuses on three fundamental mechanisms in React: deterministic data transformation, unidirectional data flow, and state-driven rendering.
1. Data Transformation & Declarative Rendering

React rendering is a pure function of state and props. Arrays are transformed into UI via functional methods.

Filtering

.filter() performs a predicate-based selection and returns a new array (non-mutating).

const filteredShoes = shoes.filter((item) => item.brand === "Adidas");
Time complexity: O(n)
No side effects
Maintains immutability (critical for React reconciliation)
Mapping to Components

.map() transforms each element into a React element.

{filteredShoes.map((product) => (
  <Card {...product} key={product.id} />
))}
Each iteration returns JSX
Spread operator (...product) passes all properties as props
Output must be deterministic for consistent rendering
Key Requirement

key={product.id} is mandatory for list rendering.

Purpose:

Enables React’s diffing algorithm (reconciliation)
Tracks element identity across renders
Prevents unnecessary re-renders and DOM mutations

Constraint:

Must be stable and unique
Avoid array index unless list is static
2. Component Communication (Unidirectional Data Flow)

React enforces a top-down data flow model.

Parent → Child (Props)
<Card name={product.name} price={product.price} />
Props are immutable inside the child
Used for configuration and data injection
Child → Parent (Callback Functions)
// Parent
const handleSelect = (id) => {
  console.log(id);
};

<Card onSelect={handleSelect} />
// Child
<button onClick={() => onSelect(product.id)}>Select</button>
Functions passed as props act as communication channels
Enables lifting state up
3. State Management (useState)

State introduces reactivity. Any state change triggers re-render.

Basic Usage
const [count, setCount] = useState(0);
count: current state
setCount: updater function
Updating State
setCount(count + 1);

For dependent updates:

setCount((prev) => prev + 1);
Prevents stale closure issues
Recommended in async or batched updates
4. Example: Integrated Pattern
function App() {
  const [brand, setBrand] = useState("Adidas");

  const filteredShoes = shoes.filter((item) => item.brand === brand);

  return (
    <div>
      {filteredShoes.map((product) => (
        <Card
          key={product.id}
          {...product}
          onSelect={(id) => console.log(id)}
        />
      ))}
    </div>
  );
}
5. Advanced Considerations
Immutability

Avoid direct mutation:

// Incorrect
shoes.push(newItem);

// Correct
setShoes([...shoes, newItem]);
Performance
Use React.memo for pure components
Use useCallback for stable function references
Avoid unnecessary re-renders by controlling state granularity
Conditional Rendering
{filteredShoes.length === 0 ? <p>No items</p> : <List />}
Because React uses the key to identify elements across renders, not just within a single render.

Core Mechanism (Reconciliation)

React compares the previous virtual DOM with the new one:

If key is stable and identical → React reuses the existing component instance
If key changes → React treats it as a completely new element
What happens with unstable keys (e.g. Math.random())

Each render:

key={Math.random()}

Result:

All keys are different every time
React assumes every item is new
Old components are destroyed (unmounted)
New components are created (mounted)
Consequences
1. No DOM reuse

React cannot match old vs new elements → full re-render of list

2. State loss

Component-local state is reset:

<input value="text" />

User types → re-render → input resets

3. Performance degradation
More DOM operations
More memory churn
Slower updates
Correct Behavior (Stable Key)
key={product.id}

React can:

Match elements correctly
Update only changed items
Preserve internal state
Summary

Stable key ⇒ identity preserved ⇒ efficient diffing
Unstable key ⇒ identity lost ⇒ full re-creation of elements
React JSX is the way you write UI in React with a syntax that looks like HTML, but it is actually JavaScript.

1) What JSX is

JSX lets you write this:

const element = <h1>Hello</h1>;

React turns it into JavaScript objects and shows it in the browser.

JSX is not HTML.

2) Basic JSX rules
One parent element

A component must return one root element:

return (
  <div>
    <h1>Hello</h1>
    <p>Text</p>
  </div>
);

If you do not want extra <div>, use Fragment:

return (
  <>
    <h1>Hello</h1>
    <p>Text</p>
  </>
);
Use {} for JavaScript

Inside JSX, JavaScript goes inside curly braces:

const name = "nha";

return <h1>Hello {name}</h1>;

You can put:

variables
numbers
function results
arrays with .map()

You cannot put full statements like if directly inside JSX.

Use className, not class
<div className="box">Content</div>
Use camelCase for attributes
<button onClick={handleClick}>Click</button>
<img src="a.jpg" alt="photo" />
3) JSX with components

React component names start with a capital letter:

function Card() {
  return <div>Card</div>;
}

Use it like this:

<Card />

Pass data with props:

<Card title="Phone" price={100} />

Inside the component:

function Card({ title, price }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{price}</p>
    </div>
  );
}
4) Props
Props are values sent from parent to child.
function User({ name, age }) {  return (    <div>      <h2>{name}</h2>      <p>{age}</p>    </div>  );}
Use:
<User name="Sok" age={20} />

5) Children
Anything inside a component tag is children.
function Box({ children }) {  return <div className="box">{children}</div>;}
Use:
<Box>  <h1>Hello</h1>  <p>Inside box</p></Box>

6) Conditional rendering
With &&
Show something only when true:
{isLoggedIn && <p>Welcome</p>}
With ternary
Choose one of two:
{isLoggedIn ? <p>Welcome</p> : <p>Please login</p>}

7) Lists with .map()
JSX often shows data arrays.
const users = ["A", "B", "C"];return (  <ul>    {users.map((user, index) => (      <li key={index}>{user}</li>    ))}  </ul>);
Best practice:
key={user.id}
Use a real unique id when possible.

8) Events
JSX uses function references.
<button onClick={handleClick}>Click</button>
With inline function:
<button onClick={() => alert("Hello")}>Click</button>

9) Forms
Input uses state:
const [name, setName] = useState("");<input  value={name}  onChange={(e) => setName(e.target.value)}/>
This is called a controlled input.

10) Styles
Inline style uses an object:
<div style={{ color: "red", fontSize: "20px" }}>  Text</div>
fontSize is camelCase.

11) Spreading props
You can pass all object values:
const product = { name: "Shoes", price: 50 };<Card {...product} />
This sends:


name


price



12) JSX comments
Inside JSX:
return (  <div>    {/* this is a comment */}    <h1>Hello</h1>  </div>);

13) JSX can use expressions, not statements
Allowed:
<h1>{2 + 2}</h1><h1>{name.toUpperCase()}</h1>
Not directly allowed:
<h1>{if (x) { ... }}</h1>
Use conditional operators instead.

14) Rendering example
Full example:
function App() {  const products = [    { id: 1, name: "Nike", price: 100 },    { id: 2, name: "Adidas", price: 120 },  ];  return (    <div>      <h1>Products</h1>      {products.map((product) => (        <div key={product.id}>          <h2>{product.name}</h2>          <p>${product.price}</p>        </div>      ))}    </div>  );}

15) Main React JSX core patterns
These are the most important ones:


Component


Props


Children


Conditional rendering


Lists with .map()


Events


Forms


Fragments


State with useState


Passing data with spread ...



16) Common mistakes
Wrong: class
<div class="box"></div>
Correct: className
<div className="box"></div>
Wrong: no key in list
items.map((item) => <li>{item.name}</li>)
Correct:
items.map((item) => <li key={item.id}>{item.name}</li>)
Wrong: changing state directly
user.name = "new";
Correct:
setUser({ ...user, name: "new" });

17) Simple JSX mental model
Think like this:
Data → JSX → UI
React takes your data and renders UI from it.

18) Very short example with state
import { useState } from "react";function App() {  const [count, setCount] = useState(0);  return (    <div>      <h1>{count}</h1>      <button onClick={() => setCount(count + 1)}>Add</button>    </div>  );}
This shows the main JSX pattern:


show value


handle click


update state


re-render UI



I can turn this into a complete React JSX lesson with examples for props, state, events, forms, map/filter, and interview questions in one clean note.
React JSX — Complete Core Patterns (Structured Reference)
1. JSX Execution Model

JSX compiles to React.createElement().

const el = <h1>Hello</h1>;

becomes:

React.createElement("h1", null, "Hello");

Result: plain JavaScript object (Virtual DOM node)

2. Rendering Pipeline
State/Props → JSX → Virtual DOM → Diff → Real DOM update
JSX is declarative
React controls DOM mutations
3. Component Architecture
Function Component
function App() {
  return <h1>Hello</h1>;
}
Composition
function Layout() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}
4. Props System
Input contract
function Card({ title, price }) {
  return <h2>{title} - {price}</h2>;
}
Usage
<Card title="Shoes" price={100} />
Spread props
const data = { title: "Shoes", price: 100 };

<Card {...data} />
5. Children Pattern
function Wrapper({ children }) {
  return <div>{children}</div>;
}
<Wrapper>
  <h1>Inside</h1>
</Wrapper>
6. Conditional Rendering
Logical AND
{isAuth && <Dashboard />}
Ternary
{isAuth ? <Dashboard /> : <Login />}
Function-based
function renderView() {
  if (isAuth) return <Dashboard />;
  return <Login />;
}
7. Lists & Identity
items.map(item => (
  <Item key={item.id} {...item} />
))

Key constraints:

Unique
Stable
Deterministic
8. Event System

Synthetic events (cross-browser abstraction)

<button onClick={handleClick}>Click</button>
const handleClick = (e) => {
  console.log(e.target);
};

Inline:

<button onClick={() => doSomething(id)} />
9. State Management (useState)
const [value, setValue] = useState(initial);

Update patterns:

setValue(newValue);

Functional:

setValue(prev => prev + 1);
10. Controlled Components (Forms)
const [input, setInput] = useState("");

<input
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>
11. Derived Rendering
const filtered = items.filter(i => i.active);
{filtered.map(i => <Item key={i.id} />)}

No mutation. Pure transformation.

12. Inline Expressions

Allowed:

{2 + 2}
{name.toUpperCase()}
{arr.map(...)}

Not allowed:

if (...) {}
for (...) {}
13. Styling System
Inline
<div style={{ color: "red", fontSize: 20 }} />
Class
<div className="box" />
14. Fragments
<>
  <h1 />
  <p />
</>

Avoid unnecessary DOM nodes.

15. Immutability Constraint

Incorrect:

state.value = 10;

Correct:

setState({ ...state, value: 10 });

Reason:

React depends on reference change
Enables shallow comparison
16. Reconciliation Rules

React compares:

prevTree vs nextTree

Rules:

Different type → full replace
Same type → update props
Keys → match list items
17. Performance Patterns
Memoization
React.memo(Component)
Stable callbacks
const fn = useCallback(() => {}, []);
Avoid re-renders
Split components
Normalize state
18. Advanced Composition
Render Props
function Data({ render }) {
  return render("data");
}
<Data render={(d) => <h1>{d}</h1>} />
Higher-Order Component (HOC)
const withAuth = (Component) => (props) => {
  return isAuth ? <Component {...props} /> : <Login />;
};
19. JSX Constraints
Must return single root
Tags must close
camelCase attributes
No direct DOM manipulation
20. Full Integrated Example
import { useState } from "react";

function App() {
  const [filter, setFilter] = useState("Adidas");

  const shoes = [
    { id: 1, brand: "Nike", price: 100 },
    { id: 2, brand: "Adidas", price: 120 },
  ];

  const result = shoes.filter(s => s.brand === filter);

  return (
    <div>
      <h1>Shoes</h1>

      {result.length === 0 ? (
        <p>No data</p>
      ) : (
        result.map(item => (
          <div key={item.id}>
            <h2>{item.brand}</h2>
            <p>{item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
21. Core Mental Model
UI = f(state, props)
JSX = UI description
State = dynamic data
Props = external input
Render = deterministic output
22. Common Failure Cases
Missing key
Mutating state
Using index as key (dynamic list)
Uncontrolled inputs
Inline functions causing re-renders (when misused)
23. Interview-Level Summary
JSX is syntactic sugar over createElement
React uses Virtual DOM + diffing
Keys enable O(n) reconciliation
State updates trigger re-render
Data flow is unidirectional
Components must be pure (no side effects in render)

End of reference.