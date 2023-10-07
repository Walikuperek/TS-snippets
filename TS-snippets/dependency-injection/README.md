# Dependency-Injection-TS

Dependency Injection Pattern in TypeScript.

## Note
Not works with Bun unfortunately, works with NodeJS
 
## Install
```bash
npm install
```

## Usage
```bash
tsc && node dist/index.js
```

Pattern usage:

```typescript
@Injectable()
class App implements OnDestroy {
  constructor(public test: Test) {}

  onDestroy(): void {
    console.log("App destroyed");
  }
}

const [entryClass, destroy] = bootstrap<App>(App);
// Initialize the entry point class instance
// Output:
//   Injector resolving class Test
//   Test constructor - created
//   Injector created class Test
//   Injector resolving class App
//   Injector created class App

entryClass.test.doSomething();
// Use the entry point class instance
// Output:
//   Test did something

destroy();
// Destroy the entry point class instance
// Output:
//   App destroyed
```
