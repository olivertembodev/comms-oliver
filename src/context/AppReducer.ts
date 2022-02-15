interface Action {
    type?: string;
    payload?: any;
}
interface State {
    selectedComponent?: string;
    elementsList?: Array<string>;
}
const Reducers = (state:State, action:Action) => {
    switch (action.type) {
      case 'SET_SELECTED_COMPONENT': {
        return {
          ...state,
          selectedComponent: action.payload,
        };
      }
      case 'SET_ELEMENTS': {
        return {
          ...state,
          elementsList: action.payload,
        };
      }
      default:
        return state;
    }
  };
  export default Reducers;
  