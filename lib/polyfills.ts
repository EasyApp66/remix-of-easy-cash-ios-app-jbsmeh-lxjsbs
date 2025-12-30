
// Polyfills for web compatibility
// This ensures that global objects are available during SSR and initial load

console.log('Polyfills: Starting initialization...');
console.log('Polyfills: Environment check - typeof window:', typeof window);
console.log('Polyfills: Environment check - typeof global:', typeof global);
console.log('Polyfills: Environment check - typeof navigator:', typeof navigator);

// Check if we're in React Native environment
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
console.log('Polyfills: Is React Native:', isReactNative);

if (isReactNative) {
  // We're in React Native, no need for window polyfills
  console.log('Polyfills: Running in React Native, skipping window polyfills');
} else {
  // We're in a web environment or SSR
  console.log('Polyfills: Running in web/SSR environment');
  
  // Ensure window is defined for web environments during SSR
  if (typeof window === 'undefined') {
    console.log('Polyfills: Creating minimal window object for SSR');
    
    // Create a minimal window object for SSR
    const mockWindow = {
      localStorage: {
        getItem: (key: string) => {
          console.log(`Polyfills: localStorage.getItem called for key: ${key}`);
          return null;
        },
        setItem: (key: string, value: string) => {
          console.log(`Polyfills: localStorage.setItem called for key: ${key}`);
        },
        removeItem: (key: string) => {
          console.log(`Polyfills: localStorage.removeItem called for key: ${key}`);
        },
        clear: () => {
          console.log('Polyfills: localStorage.clear called');
        },
        key: (index: number) => {
          console.log(`Polyfills: localStorage.key called for index: ${index}`);
          return null;
        },
        length: 0,
      },
      location: {
        href: '',
        origin: '',
        protocol: '',
        host: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
      },
      navigator: {
        userAgent: '',
      },
      document: {
        createElement: () => ({}),
        getElementById: () => null,
        querySelector: () => null,
      },
    };
    
    // @ts-expect-error - Creating a minimal window object for SSR
    global.window = mockWindow as any;
    console.log('Polyfills: Window object created');
  }

  // Ensure localStorage is available
  if (typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
    console.log('Polyfills: Creating localStorage implementation');
    
    // Create a minimal localStorage implementation
    const storage: { [key: string]: string } = {};
    
    // @ts-expect-error - Creating a minimal localStorage implementation
    window.localStorage = {
      getItem: (key: string) => {
        console.log(`Polyfills: localStorage.getItem called for key: ${key}`);
        return storage[key] || null;
      },
      setItem: (key: string, value: string) => {
        console.log(`Polyfills: localStorage.setItem called for key: ${key}`);
        storage[key] = value;
      },
      removeItem: (key: string) => {
        console.log(`Polyfills: localStorage.removeItem called for key: ${key}`);
        delete storage[key];
      },
      clear: () => {
        console.log('Polyfills: localStorage.clear called');
        Object.keys(storage).forEach(key => delete storage[key]);
      },
      key: (index: number) => {
        console.log(`Polyfills: localStorage.key called for index: ${index}`);
        return Object.keys(storage)[index] || null;
      },
      get length() {
        return Object.keys(storage).length;
      },
    };
    console.log('Polyfills: localStorage created');
  }
}

console.log('Polyfills: Initialization complete');
console.log('Polyfills: Final window check - typeof window:', typeof window);
