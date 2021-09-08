/**
 * Redcuer for dark theme
 * @param state - Current state
 * @param action - Action to be carried out
 * @returns If the theme should be dark or not
 */
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
