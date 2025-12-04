import { createContext } from 'react';

// Separate file to hold the context object so other files can import
// non-component exports without breaking react-refresh rules.
export const AuthContext = createContext();
