/**
 * Dependency Injection Pattern
 * 
 * ## Note
 * Not works with Bun unfortunately, works with NodeJS
 * 
 * ## Install
 * ```bash
 * npm install reflect-metadata
 * ```
 * 
 * ## Usage
 * ```bash
 * tsc && node dist/index.js
 * ```
 */

import "reflect-metadata";

export interface Type<T> {
  new (...args: any[]): T;
}

/**
 * Decorator function to annotate classes which can inject another ones in constructors.
 * A decorator is required to be able to get Reflect's metadata.
 */
export const Injectable = (): ((target: Type<any>) => void) => {
  return (target: Type<any>) => {};
};

/**
 * Lifecycle hook that is used for releasing a resource.
 * It will be called automatically by DI container.
 */
export interface OnDestroy {
  onDestroy(): void;
}

/**
 * Every entry point class instance starts its own dependency container.
 * Injector ensures that all decorated classes in the container are singletons.
 */
export class Injector extends Map {
  public resolve<T>(target: Type<any>): T {
    const tokens = Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = tokens.map((token: Type<any>) => {
      return this.resolve<any>(token);
    });
    console.log(`Injector is resolving class ${target.name}`);

    const classInstance = this.get(target);
    if (classInstance) {
      return classInstance;
    }

    const newClassInstance = new target(...injections);
    this.set(target, newClassInstance);

    console.log(
      `Injector has created class ${newClassInstance.constructor.name}`
    );

    return newClassInstance;
  }

  public onDestroy(): void {
    for (const value of this.values()) {
      if (typeof value["onDestroy"] === "function") {
        value["onDestroy"]();
      }
    }

    this.clear();
  }
}

/**
 * Bootstraps the entry point class instance of type T.
 *
 * @returns entry point class instance and the "release" function which releases the DI container
 */
export const bootstrap = <T>(target: Type<any>): [T, () => void] => {
  // there is exactly one Injector pro entry point class instance
  const injector = new Injector();
  // bootstrap all dependencies
  const entryClass = injector.resolve<T>(target);

  return [entryClass, () => injector.onDestroy()];
};

// ============================================================================
// Usage example                                                              =
// ============================================================================

// Simple class for dependency injection test
class Test {
  constructor() {
    console.log("Test constructor - created");
  }

  doSomething(): void {
    console.log("Test did something");
  }
}

// Entry point class
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
