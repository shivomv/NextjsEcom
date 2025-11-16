import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

/**
 * Create an optimized context provider with memoized values and actions
 * to prevent unnecessary re-renders
 * 
 * @param {string} name - Name of the context
 * @param {Object} initialState - Initial state object
 * @param {Object} reducerFn - Reducer function
 * @param {Object} actions - Object with action creator functions
 * @returns {Object} - Context provider and hooks
 */
export function createOptimizedContext(name, initialState, reducerFn, actions) {
  // Create the context
  const Context = createContext();
  
  // Create the provider component
  function Provider({ children }) {
    // Use reducer for state management
    const [state, dispatch] = useReducer(reducerFn, initialState);
    
    // Memoize action creators to prevent unnecessary re-renders
    const memoizedActions = useMemo(() => {
      const actionCreators = {};
      
      // Create memoized action creators
      Object.keys(actions).forEach(actionName => {
        actionCreators[actionName] = useCallback(
          (...args) => {
            const action = actions[actionName](...args);
            dispatch(action);
          },
          [dispatch]
        );
      });
      
      return actionCreators;
    }, [dispatch]);
    
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => {
      return {
        state,
        ...memoizedActions,
      };
    }, [state, memoizedActions]);
    
    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    );
  }
  
  // Create a custom hook to use the context
  function useOptimizedContext() {
    const context = useContext(Context);
    
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    
    return context;
  }
  
  // Create a selector hook to select specific parts of the state
  function useContextSelector(selector) {
    const context = useOptimizedContext();
    
    // Memoize the selected value to prevent unnecessary re-renders
    return useMemo(() => {
      return selector(context.state);
    }, [selector, context.state]);
  }
  
  return {
    Provider,
    useContext: useOptimizedContext,
    useSelector: useContextSelector,
  };
}
