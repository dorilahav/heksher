<h1 align="center">Heksher</h1>

<div align="center">

**Heksher** is like the cool, upgraded sibling of the regular React Context API. It only triggers re-renders when the stuff you're using actually changes.

[![Bundle Size](https://badgen.net/bundlephobia/minzip/heksher)](https://bundlephobia.com/package/heksher)
[![Latest Version](https://badgen.net/npm/v/heksher)](https://www.npmjs.com/package/heksher)

</div>

## Installation
```bash
npm install heksher # or yarn add heksher or pnpm add heksher
```

Heksher requires `react@16.3.0` or newer to work, this is because in this version of react the new context api was introduced.

## Getting Started
Lets suppose we are creating a game app and we want to tell our entire app the current time (which is fetched from the server).

We will start by creating a `CurrentTimeHeksher`:
```typescript jsx
import {createHeksher} from 'heksher';

const CurrentTimeHeksher = createHeksher<Date>();
```
Then we will create our provider which will fetch the current time from the server and provide it to the app.
To do so, we will use the `.Provider` component that `createHeksher` gives us.
```typescript jsx
const CurrentTimeProvider = ({children}: PropsWithChildren) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  useEffect(() => {
    // Some time fetching mechanism
  }, []);
  
  if (!currentTime) {
    return <CurrentTimeLoadingScreen/>;
  }
  
  return (
    <CurrentTimeHeksher.Provider value={currentTime}>
      {children}
    </CurrentTimeHeksher.Provider>
  );
}
```

Now that we have the component that provides us with the current time, we need a way to get it in our application.
For that we will use the `.use` hook the `createHeksher` function gives us.
```typescript jsx
const useCurrentTime = CurrentTimeHeksher.use;
```
Now lets use our new Heksher:
```typescript jsx
const Game = () => {
  const currentTime = useCurrentTime();
  
  return (
    <div>
      <TimeDisplay time={currentTime}/>
      {/* The rest of the game*/}
    </div>
  )
}

const App = () => (
  <CurrentTimeProvider>
    <Game/>
  </CurrentTimeProvider>
);
```

Looks similar huh? Well, that's because **Heksher**'s API was inspired by the `ReactContextAPI`.
You might be asking yourself - why shouldn't I just use it then?
Lets answer that question together.

## The Problem With React Context
Lets ask ChatGPT

![The Problem With React Context](https://i.imgur.com/7FyP1Rm.jpg)

Well... if you are wondering, that's still the case :P

Lets take this code as an example:
```typescript jsx
interface TimerContextValue {
  elapsedTime: number;
  startTimer: () => void;
}

const TimerContext = createContext<TimerContextValue>({} as TimerContextValue);

const TimerProvider = ({children}: PropsWithChildren) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const startTimer = () => {
    const startDate = Date.now();
    
    setInterval(() => {
      setElapsedTime(Date.now() - startDate)
    }, 100);
  }
  
  return (
    <TimerContext.Provider value={{elapsedTime, startTimer}}>
      {children}
    </TimerContext.Provider>
  )
}

const useTimer = () => useContext(TimerContext);

const StartTimerButton = () => {
  const {startTimer} = useTimer();
  
  return <button onClick={startTimer}>Start Timer</button>
}
```

How often do you think `StartTimerButton` will re-render?

1. One time only 
2. Every 100ms
3. Every time the button is clicked

...

If you guessed `2` you will be right. Even though `StartTimerButton` only uses the `startTimer` function that doesn't change, it will still be re-rendered every 100ms. 

Lets try to optimize it:

```typescript jsx
const TimerProvider = ({children}: PropsWithChildren) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimer = useCallback(() => {
    const startDate = Date.now();

    setInterval(() => {
      setElapsedTime(Date.now() - startDate)
    }, 100);
  }, []);

  return (
    <TimerContext.Provider value={useMemo(() => ({elapsedTime, startTimer}), [elapsedTime])}>
      {children}
    </TimerContext.Provider>
  )
}
```

We added a `useCallback` and a `useMemo` but we still get that re-render every `100ms` why is that?
Well, React Context is not very sophisticated - when value changes, every `useContext` is re-rendered.
Even with that `useMemo`, the value changes every time `elapsedTime` is changed and a re-render will occur.

What can you do? **Use Heksher**

## Solution
Lets take the same timer example from above but use **Heksher** instead:

```typescript jsx
import {createHeksher} from 'heksher';

const TimerHeksher = createHeksher<TimerHeksherValue>();

const TimerProvider = ({children}: PropsWithChildren) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimer = useCallback(() => {
    const startDate = Date.now();

    setInterval(() => {
      setElapsedTime(Date.now() - startDate)
    }, 100);
  }, []);

  return (
    <TimerHeksher.Provider value={{elapsedTime, startTimer}}>
      {children}
    </TimerHeksher.Provider>
  )
}

const StartTimerButton = () => {
  const {startTimer} = TimerHeksher.use();

  return <button onClick={startTimer}>Start Timer</button>
}
```

Thats it! We now have an optimized heksher, using it anywhere in our app will only trigger re-renders on the fields we used.

Now our `StartTimerButton` will only render once.

## Best Practices
### Memoization
Did you notice the example up there?
No `useMemo` on the value object, kinda weird, huh? Well, **Heksher** handles that for us, no need to wrap the value with useMemo.
But don't forget to memoize all the fields inside the value, that's really important in order to minimize unneeded renders.

Lets see an example:
```typescript jsx
interface RandomNumberHeksherValue {
  number: number;
  generateNewNumber: (min: number, max: number) => void;
}

const RandomNumberHeksher = createHeksher<RandomNumberHeksherValue>();

const RandomNumberProvider = ({children}: PropsWithChildren) => {
  const [number, setNumber] = useState(-1);
  
  const generateNewNumber = (min: number, max: number) => {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    
    setNumber(randomNumber);
  }

  return (
    <RandomNumberHeksher.Provider value={{number, generateNewNumber}}>
      {children}
    </RandomNumberHeksher.Provider>
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

### Using Objects Instead Of Tuples
We've all used `useState` before.
I don't know about you, but one of the things that I really like about it is the fact that you can simply give the state value / set state function any name you want by simply destructuring an array.
```typescript
const [name, setName] = useState('');
```
Sooo easy!

Well, if you'd want to do that with a `Heksher` you might want to wait a few versions until an official support is added.
As of right now, providing a `tuple` will re-render every usage of the `Heksher`, doesn't matter what field of it you accessed, that's in order to allow providing arrays.
