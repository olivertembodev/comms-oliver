import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

const initialState = {
  selectedComponent: null,
  setSelectedComponent: (value:string) => {},
  elementsList: [],
  setElementsList: (value:Array<string>) => {},
};
export const GlobalContext = createContext(initialState);
const StateProvider = GlobalContext.Provider;
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function setSelectedComponent(selectedComponent:string) {
    dispatch({ type: 'SET_SELECTED_COMPONENT', payload: selectedComponent });
  }
  function setElementsList(elementsList:Array<string>) {
    dispatch({ type: 'SET_ELEMENTS', payload: elementsList });
  }
  return (
    <StateProvider
      value={{
        selectedComponent: state.selectedComponent,
        setSelectedComponent,
        elementsList: state.elementsList,
        setElementsList,
      }}
    >
      {children}
    </StateProvider>
  );
};
