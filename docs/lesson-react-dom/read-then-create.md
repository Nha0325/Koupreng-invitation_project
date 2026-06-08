React 0–100 សម្រាប់បង្រៀន — Khmer Teacher Notes

កំណែផ្លូវការដែលបានយោងនៅក្នុង React docs បច្ចុប្បន្នបង្ហាញ react@19.2 និង react-dom@19.2។ React Learn ចាប់ផ្តើមពី Components, JSX, styles, displaying data, conditional rendering, lists, events, state, Hooks, និង sharing data between components។

1. React គឺអ្វី?

React គឺជា JavaScript library សម្រាប់បង្កើត UI ដោយបំបែក UI ជា Components។ Component មួយអាចតូចដូច button ឬធំដូច page ទាំងមូល។ ក្នុង React, component ជា JavaScript function ដែល return markup/JSX។

function MyButton() {
  return <button>Click me</button>;
}

export default function App() {
  return (
    <div>
      <h1>Hello React</h1>
      <MyButton />
    </div>
  );
}

ចំណុចបង្រៀន:
React មិនគិតជា “page first” ទេ។ React គិតជា “component first”។ UI ធំ = component តូចៗច្រើនបញ្ចូលគ្នា។

2. ReactDOM គឺអ្វី?

ReactDOM គឺ package សម្រាប់ភ្ជាប់ React ជាមួយ browser DOM។ Official docs បញ្ជាក់ថា react-dom មាន methods ដែល support សម្រាប់ web applications ដែល run ក្នុង browser DOM environment ប៉ុណ្ណោះ និងមិន support React Native ទេ។

ReactDOM APIs សំខាន់ៗ
API	ប្រើសម្រាប់អ្វី	ពេលណាបង្រៀន
createRoot	render React component ចូល browser DOM node	មេរៀនដំបូង
hydrateRoot	attach React ទៅ HTML ដែល server render រួច	SSR / framework
createPortal	render child component ទៅ DOM កន្លែងផ្សេង	Modal, tooltip
flushSync	force update DOM synchronous	ករណីពិសេស, កុំប្រើញឹកញាប់
preconnect, prefetchDNS, preload, preloadModule, preinit, preinitModule	resource loading optimization	performance lesson

ReactDOM docs បញ្ជាក់ថា createPortal render children ទៅ DOM tree ផ្សេង, flushSync force update DOM synchronous, និង resource preloading APIs អាច preload scripts, stylesheets, fonts ជាដើម។

import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);

ចំណុចបង្រៀន:
react = logic/UI model.
react-dom = ឧបករណ៍យក React ទៅបង្ហាញលើ browser DOM.

3. JSX

JSX គឺ syntax សរសេរ markup នៅក្នុង JavaScript។ JSX មិនមែន HTML 100% ទេ។ វាតឹងជាង HTML៖ ត្រូវបិទ tag ដូចជា <br /> ហើយ component មួយមិនអាច return JSX tags ច្រើនដែលនៅដាច់ពីគ្នា ដោយគ្មាន parent wrapper ឬ Fragment <>...</> បានទេ។

function Profile() {
  return (
    <>
      <h1>Nha</h1>
      <p>React Teacher</p>
    </>
  );
}
JSX Rules
Rule	ឧទាហរណ៍ត្រឹមត្រូវ
Component name ចាប់ផ្តើមអក្សរធំ	<MyButton />
HTML tag អក្សរតូច	<button>
class → className	<div className="card">
JavaScript expression ប្រើ {}	<h1>{user.name}</h1>
style ប្រើ object	<img style={{ width: 100 }} />
4. Displaying Data

JSX ប្រើ {} ដើម្បីចូលទៅ JavaScript expression។ ប្រើបានសម្រាប់ text, attributes, expression, calculation, string concatenation។ React docs បង្ហាញថា src={user.imageUrl} អានតម្លៃពី JavaScript variable មិនមែន string ធម្មតាទេ។

const user = {
  name: 'Nha',
  imageUrl: '/avatar.png',
  imageSize: 100,
};

function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize,
        }}
      />
    </>
  );
}

ចំណុចបង្រៀន:
"avatar" = string fixed.
{user.imageUrl} = value ពី JavaScript.

5. Conditional Rendering

React មិនមាន syntax ពិសេសសម្រាប់ condition ទេ។ ប្រើ JavaScript if, ternary ? :, ឬ &&។ Official docs បញ្ជាក់ថា condition ក្នុង React ប្រើ technique ដូច JavaScript ធម្មតា។

function Dashboard({ isLoggedIn }) {
  if (isLoggedIn) {
    return <AdminPanel />;
  }

  return <LoginForm />;
}
function Dashboard({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <AdminPanel /> : <LoginForm />}
    </div>
  );
}
function Notification({ hasNewMessage }) {
  return (
    <div>
      {hasNewMessage && <p>You have new messages</p>}
    </div>
  );
}
6. Rendering Lists

React ប្រើ JavaScript map() ដើម្បីបម្លែង array ទៅ JSX list។ ក្នុង list ត្រូវមាន key ដើម្បីឱ្យ React ស្គាល់ item នីមួយៗពេល insert, delete, reorder។

const products = [
  { id: 1, title: 'Laptop' },
  { id: 2, title: 'Mouse' },
  { id: 3, title: 'Keyboard' },
];

function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

កុំប្រើ index ជា key ប្រសិនបើ list អាច reorder/delete។ ប្រើ database id ឬ unique id ពី data។

7. Events

React event handler គឺ function ដែល pass ទៅ event prop ដូចជា onClick={handleClick}។ Official docs បញ្ជាក់ថា onClick={handleClick} មិនមាន parentheses ពីក្រោយទេ ព្រោះយើង pass function មិនមែន call function ភ្លាមៗទេ។

function Button() {
  function handleClick() {
    alert('Clicked');
  }

  return <button onClick={handleClick}>Click</button>;
}

ខុស៖

<button onClick={handleClick()}>Click</button>

ត្រូវ៖

<button onClick={handleClick}>Click</button>
8. State និង useState

State គឺ memory របស់ component។ useState ផ្តល់ current state និង function សម្រាប់ update state។ Official docs បញ្ជាក់ convention ជា [something, setSomething]។

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

ចំណុចបង្រៀន:
ពេល setCount() ត្រូវបាន call, React render component ម្តងទៀត។ UI ផ្លាស់ប្តូរតាម state ថ្មី។

9. Props

Props គឺ data ដែល parent component ផ្ញើទៅ child component។ React docs ពន្យល់ថាព័ត៌មានដែល pass ពី parent ទៅ child ដូចជា count={count} និង onClick={handleClick} ត្រូវហៅថា props។

function App() {
  return <UserCard name="Nha" role="Teacher" />;
}

function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

State vs Props

Topic	State	Props
អ្នកគ្រប់គ្រង	Component ខ្លួនឯង	Parent component
អាច update នៅណា	ក្នុង component ដែលមាន state	Parent update
ប្រើសម្រាប់	data ផ្លាស់ប្តូរ	បញ្ជូន data
10. Lifting State Up

ពេល components ច្រើនត្រូវការប្រើ state ដូចគ្នា ត្រូវលើក state ទៅ parent ដែលនៅជិតបំផុត។ Official docs ហៅ pattern នេះថា “lifting state up”។

import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <Counter count={count} onClick={handleClick} />
      <Counter count={count} onClick={handleClick} />
    </>
  );
}

function Counter({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Count: {count}
    </button>
  );
}

ចំណុចបង្រៀន:
State មួយនៅ parent → child ច្រើនទទួល data ដូចគ្នា → UI sync គ្នា។

11. Rules of Hooks

Hooks គឺ functions ដែលចាប់ផ្តើមដោយ use។ Official docs បញ្ជាក់ថា Hooks ត្រូវ call នៅ top level របស់ component ឬ custom hook ប៉ុណ្ណោះ មិនត្រូវ call ក្នុង loops, conditions, ឬ nested functions ទេ។

ត្រូវ៖

function Profile() {
  const [name, setName] = useState('');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

ខុស៖

function Profile({ isAdmin }) {
  if (isAdmin) {
    const [role, setRole] = useState('admin');
  }
}
12. Hooks ទាំងអស់ក្នុង React

Official React Hooks page បែងចែក Hooks ជា State Hooks, Context Hooks, Ref Hooks, Effect Hooks, Performance Hooks, និង Other Hooks។

State Hooks
Hook	ប្រើសម្រាប់អ្វី	Example
useState	state សាមញ្ញ	counter, input
useReducer	state logic ស្មុគស្មាញ	cart, form reducer
const [count, setCount] = useState(0);
const [state, dispatch] = useReducer(reducer, initialState);
Context Hook
Hook	ប្រើសម្រាប់អ្វី
useContext	អាន context ពី parent ឆ្ងាយ ដោយមិនចាំបាច់ pass props ច្រើនជាន់
const theme = useContext(ThemeContext);
Ref Hooks
Hook	ប្រើសម្រាប់អ្វី
useRef	រក្សាតម្លៃដែលមិន trigger render ឬចាប់ DOM node
useImperativeHandle	customize ref ដែល expose ទៅ parent; កម្រប្រើ
const inputRef = useRef(null);
Effect Hooks
Hook	ប្រើសម្រាប់អ្វី
useEffect	sync component ជាមួយ external system
useLayoutEffect	run មុន browser repaint; ប្រើវាស់ layout
useInsertionEffect	សម្រាប់ CSS-in-JS libraries insert CSS មុន DOM changes
useEffectEvent	បំបែក non-reactive logic ចេញពី Effect

React docs បញ្ជាក់ថា useLayoutEffect និង useInsertionEffect ជា variations កម្រប្រើនៃ useEffect ដែលខុសគ្នាលើ timing។

Performance Hooks
Hook	ប្រើសម្រាប់អ្វី
useMemo	cache result នៃ expensive calculation
useCallback	cache function definition
useTransition	mark update ជា non-blocking
useDeferredValue	defer update ផ្នែក UI មិនសំខាន់

React docs បញ្ជាក់ថា useMemo និង useCallback ប្រើដើម្បី skip unnecessary work, ខណៈ useTransition និង useDeferredValue ជួយ prioritize rendering។

Other Hooks
Hook	ប្រើសម្រាប់អ្វី
useDebugValue	បង្ហាញ label ក្នុង React DevTools សម្រាប់ custom hook
useId	បង្កើត unique ID សម្រាប់ accessibility
useSyncExternalStore	subscribe ទៅ external store
useActionState	manage state របស់ actions
useOptimistic	optimistic UI update ពេល action មិនទាន់ចប់

ReactDOM មាន Hook ផ្ទាល់ខ្លួនសំខាន់មួយគឺ useFormStatus សម្រាប់ update UI ផ្អែកលើ status នៃ form submission។

13. useEffect លម្អិតសម្រាប់បង្រៀន

useEffect គឺ React Hook សម្រាប់ synchronize component ជាមួយ external system។ Signature គឺ useEffect(setup, dependencies?)។

useEffect(() => {
  // setup
  return () => {
    // cleanup
  };
}, [dependencies]);
ពេលណាត្រូវប្រើ useEffect

ប្រើពេល component ត្រូវភ្ជាប់ជាមួយអ្វីខាងក្រៅ React៖

External system	Example
Browser API	window.addEventListener
Timer	setInterval, setTimeout
Network	fetch data
Third-party library	chart library, map library
DOM/manual widget	modal, animation

React docs បញ្ជាក់ថា Effect run បន្ទាប់ពី rendering ដើម្បី synchronize component ជាមួយ system ខាងក្រៅ React។

Example: document title
import { useEffect, useState } from 'react';

function PageTitleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count {count}
    </button>
  );
}
Example: event listener with cleanup
import { useEffect, useState } from 'react';

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <p>Width: {width}</p>;
}
Dependency array
Syntax	Meaning
useEffect(fn)	run after every render
useEffect(fn, [])	run after first mount only, plus dev StrictMode extra check
useEffect(fn, [value])	run when value changes

React docs បញ្ជាក់ថា dependencies គឺ reactive values ដូចជា props, state, និង variables/functions ក្នុង component body; បើ omit dependency array, Effect re-run after every commit។

Cleanup

Effect lifecycle មិនដូច component lifecycle ទេ។ Effect មានតែ “start synchronizing” និង “stop synchronizing”។ វាអាច start/stop ច្រើនដងពេល dependencies ផ្លាស់ប្តូរ។

useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [roomId]);
កុំប្រើ useEffect បើមិនចាំបាច់

React docs បញ្ជាក់ថា Effects ជា escape hatch; បើគ្រាន់តែ calculate value ពី props/state មិនគួរដាក់ក្នុង state ហើយ update ដោយ Effect ទេ។ គួរ calculate ក្នុង render ផ្ទាល់។

ខុស៖

function FullName({ firstName, lastName }) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);

  return <p>{fullName}</p>;
}

ត្រូវ៖

function FullName({ firstName, lastName }) {
  const fullName = firstName + ' ' + lastName;
  return <p>{fullName}</p>;
}
14. Custom Hooks

Custom Hook គឺ function ដែលចាប់ផ្តើមដោយ use ហើយបញ្ចូល logic ដែលអាច reuse បាន។ Official docs បញ្ជាក់ថាអ្នកអាច combine built-in Hooks ដើម្បីបង្កើត Hooks ផ្ទាល់ខ្លួន។

import { useEffect, useState } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function App() {
  const width = useWindowWidth();
  return <p>Width: {width}</p>;
}
អត្ថប្រយោជន៍ Custom Hooks
Reuse logic ក្នុង components ច្រើន
កាត់បន្ថយ duplicated code
ធ្វើឱ្យ component UI ស្អាត និងអានងាយ
បំបែក business logic ចេញពី UI
ងាយ test និង maintain

ផ្នែក text ដែលអ្នកផ្ដល់ក៏បង្ហាញគំនិតដូចគ្នា៖ Custom Hooks ជួយ reuse logic, combine Hooks មានស្រាប់, និងធ្វើឱ្យ component code ស្អាតជាងមុន។

15. Zustand សម្រាប់ State Management

Zustand គឺ state management library សម្រាប់ React។ Official Zustand repository ពណ៌នាថា វាជា small, fast, scalable state-management solution ដែលប្រើ simplified flux principles, API ផ្អែកលើ Hooks, មិន boilerplate និងមិនតម្រូវឱ្យ wrap app ក្នុង Context Providers។

npm install zustand
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increase = useCounterStore((state) => state.increase);

  return (
    <button onClick={increase}>
      Count: {count}
    </button>
  );
}
Zustand Core Concepts
Concept	Meaning
Store	កន្លែងរក្សា state និង actions
State	data ដែល component ត្រូវប្រើ
Action	function សម្រាប់ update state
Selector	function ជ្រើសយក state slice
Middleware	function បន្ថែមសមត្ថភាព store
Zustand vs React State
Case	ប្រើអ្វី
State នៅ component មួយ	useState
State logic ស្មុគស្មាញក្នុង component	useReducer
Data ចែករំលែកជ្រៅៗ	Context ឬ Zustand
Global state ច្រើន components ប្រើ	Zustand
App ធំ, strict architecture	Redux / Zustand អាស្រ័យលើ team
16. Zustand Middleware

Official Zustand docs/repository បង្ហាញថា store ជា Hook, update ត្រូវធ្វើ immutably, selector ជួយឱ្យ component re-render តែពេល selected state ផ្លាស់ប្តូរ។

Persist

persist រក្សាទុក state ក្នុង storage ដូចជា localStorage, AsyncStorage, ឬ IndexedDB។ Official Zustand docs បញ្ជាក់ថា Persist middleware អនុញ្ញាតឱ្យ store state ទៅ storage។

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
Devtools

ប្រើសម្រាប់ debug state changes ជាមួយ Redux DevTools.

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools((set) => ({
    count: 0,
    increase: () => set((s) => ({ count: s.count + 1 }), false, 'increase'),
  }))
);
Immer

ប្រើសម្រាប់ nested state ដើម្បីសរសេរកូដដូច mutate តែរក្សា immutable update។

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useCartStore = create(
  immer((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        state.items.push(item);
      }),
  }))
);
17. Lesson Plan 0–100 សម្រាប់បង្រៀន
Level	Topic	Objective	Practice
0–10	React concept + setup	យល់ component-based UI	Create Vite React app
10–20	Components + JSX	បង្កើត component និង JSX rules	Button, Card, Navbar
20–30	Props + data display	Pass data parent → child	UserCard list
30–40	Conditional + lists	Render UI តាម condition និង array	Todo list
40–50	Events	Handle click/input/submit	Counter, form input
50–60	State/useState	Manage local state	Counter, toggle, form
60–70	Lifting state up	Share state between components	Shared counter
70–80	useEffect + refs	External sync, cleanup, DOM ref	Window resize, timer
80–85	Custom Hooks	Reuse component logic	useWindowWidth
85–90	useReducer/useContext	Complex local/global state	Cart reducer
90–95	ReactDOM	createRoot, portal, flushSync, hydration concept	Modal with portal
95–100	Zustand	Global state, selectors, middleware	Cart/auth/theme store
18. Mini Project សម្រាប់បញ្ចប់មេរៀន
Project: Student Management App

Features:

បង្ហាញ student list
Add student
Delete student
Search student
Toggle dark/light theme
Persist theme with Zustand
Modal using createPortal
Fetch fake data with useEffect
Custom Hook useDebounce សម្រាប់ search
Split components: StudentList, StudentForm, SearchBox, ThemeToggle, Modal
Concepts covered
Feature	React concept
Student list	map, key
Add/delete	useState / Zustand action
Search	derived data
Theme	global state
Persist theme	Zustand persist
Modal	ReactDOM createPortal
Fetch data	useEffect
Debounced search	Custom Hook
19. សំណួរត្រួតពិនិត្យសិស្ស
Component ខុសពី HTML tag ដូចម្តេច?
ហេតុអ្វី component name ត្រូវចាប់ផ្តើមអក្សរធំ?
JSX ខុសពី HTML ត្រង់ណា?
{} ក្នុង JSX ប្រើសម្រាប់អ្វី?
Props និង State ខុសគ្នាដូចម្តេច?
ហេតុអ្វី list ត្រូវការ key?
ហេតុអ្វី onClick={handleClick} មិនដាក់ ()?
ពេលណាត្រូវ lift state up?
Rules of Hooks មានអ្វីខ្លះ?
useEffect ប្រើពេលណា?
ពេលណាមិនគួរប្រើ useEffect?
Cleanup function ក្នុង useEffect ប្រើសម្រាប់អ្វី?
useMemo និង useCallback ខុសគ្នាដូចម្តេច?
ReactDOM ប្រើសម្រាប់អ្វី?
Zustand ខុសពី Context ត្រង់ណា?
20. សង្ខេបសម្រាប់បិទមេរៀន

React គិតជា Components។ JSX អនុញ្ញាតឱ្យសរសេរ markup ក្នុង JavaScript។ Props បញ្ជូន data ពី parent ទៅ child។ State គឺ memory របស់ component។ Hooks គឺ functions ចាប់ផ្តើមដោយ use ដែលអនុញ្ញាតឱ្យប្រើ React features។ useEffect មិនមែនសម្រាប់គ្រប់ logic ទេ; វាសម្រាប់ sync ជាមួយ external systems។ ReactDOM គឺ bridge រវាង React និង browser DOM។ Zustand គឺជាជម្រើសសាមញ្ញសម្រាប់ global state management ដោយប្រើ Hook-based store និង selectors។
