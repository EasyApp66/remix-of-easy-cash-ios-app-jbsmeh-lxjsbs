
// Polyfills for web compatibility
// This ensures that global objects are available during SSR and initial load

console.log('Polyfills: Starting initialization...');

// Only apply polyfills if we're in a web environment
if (typeof navigator !== 'undefined' && navigator.product !== 'ReactNative') {
  console.log('Polyfills: Running in web environment');
  
  // Ensure window is defined for web environments during SSR
  if (typeof window === 'undefined') {
    console.log('Polyfills: Creating minimal window object for SSR');
    
    // Create a minimal window object for SSR
    const mockWindow = {
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
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
    
    const storage: { [key: string]: string } = {};
    
    // @ts-expect-error - Creating a minimal localStorage implementation
    window.localStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = value; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(key => delete storage[key]); },
      key: (index: number) => Object.keys(storage)[index] || null,
      get length() { return Object.keys(storage).length; },
    };
    console.log('Polyfills: localStorage created');
  }
} else {
  console.log('Polyfills: Running in React Native, skipping polyfills');
}

console.log('Polyfills: Initialization complete');
