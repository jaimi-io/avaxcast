function darkReducer(state = false, action: Action): boolean {
  switch (action.type) {
    case "LIGHT ON":
      return false;
    case "LIGHT OFF":
      return true;
    default:
      return state;
  }
}

export default darkReducer;
