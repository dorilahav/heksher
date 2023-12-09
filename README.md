<h1 align="center">Optimized Context</h1>

<div align="center">

**Optimized Context** is like the cool, upgraded sibling of the regular React Context API. It only triggers re-renders when the stuff you're using actually changes.

[![Bundle Size](https://badgen.net/bundlephobia/minzip/optimized-context)](https://bundlephobia.com/package/optimized-context)
[![Latest Version](https://badgen.net/npm/v/optimized-context)](https://www.npmjs.com/package/optimized-context)

</div>

## Installation
```bash
npm install optimized-context # or yarn add optimized-context or pnpm add optimized-context
```

Optimized Context requires `react@16.3.0` or newer to work, this is because in this version of react the new context api was introduced.

## Getting Started
Lets add an auth mechanism to our beautiful app

First we need to create an auth context:
```typescript jsx
interface User {
  name: string,
  age: number
};

interface AuthContextValue {
  loggedUser?: User;
  isLoggedIn: boolean;
}

const AuthContext = createOptimizedContext<AuthContextValue>();
```

Then lets create our provider:
```typescript jsx
...
const AuthProvider = ({children}: any) => {
  const [loggedUser, setLoggedUser] = useState<User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Some login logic
  
  return (
    <AuthContext.Provider value={{loggedUser, isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
}
```
Looks familiar?

Now lets create a simple `useAuth` hook:
```typescript jsx
...
const useAuth = AuthContext.use;
```

Thats it! We now have an optimized context, using it anywhere in our app will only trigger re-renders on the fields we used.

## Best Practices
### Memoization
Did you notice the example up there?
No `useMemo` on the value object, kinda weird, huh? Well, the **Optimized Context** handles that for us, no need to wrap the value with useMemo.
But hey, remember to memoize all the fields inside it, that's key.

Lets see an example:
```typescript jsx
interface RandomNumberContextValue {
  number: number;
  generateNewNumber: (min: number, max: number) => void;
}

const RandomNumberContext = createOptimizedContext<RandomNumberContextValue>();

const RandomNumberProvider = ({children}: any) => {
  const [number, setNumber] = useState(-1);
  
  const generateNewNumber = (min: number, max: number) => {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    
    setNumber(randomNumber);
  }

  return (
    <RandomNumberContext.Provider value={{number, generateNewNumber}}>
      {children}
    </RandomNumberContext.Provider>
  );
}
```
Notice the issue?

The `generateNewNumber` function isn't getting memoized; a fresh function is made every time the provider renders, causing a re-render when `generateNewNumber` is used.

To fix this hiccup, we'll wrap the function with `useCallback` and feed it into the value object.

```typescript jsx
const generateNewNumber = useCallback((min: number, max: number) => {
  const randomNumber = Math.floor(Math.random() * (max - min)) + min;

  setNumber(randomNumber);
}, []);
```
This is much better.

The final code will look like this:
```typescript jsx
interface RandomNumberContextValue {
  number: number;
  generateNewNumber: (min: number, max: number) => void;
}

const RandomNumberContext = createOptimizedContext<RandomNumberContextValue>();

const RandomNumberProvider = ({children}: any) => {
  const [number, setNumber] = useState(-1);

  const generateNewNumber = useCallback((min: number, max: number) => {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;

    setNumber(randomNumber);
  }, []);

  return (
    <RandomNumberContext.Provider value={{number, generateNewNumber}}>
      {children}
    </RandomNumberContext.Provider>
  );
}
```