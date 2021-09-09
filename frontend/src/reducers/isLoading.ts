/**
 * Redcuer for loading buffer icon
 * @param state - Current state
 * @param action - Action to be carried out
 * @returns If buffer icon should be displayed
 */
function loadingReducer(state = false, action: Action): boolean {
  switch (action.type) {
    case "LOADING":
      return true;
    case "NOT LOADING":
      return false;
    default:
      return state;
  }
}

export default loadingReducer;
