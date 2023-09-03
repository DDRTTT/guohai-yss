export function stateClear(model) {
  model.state.initialStateBackup = model.state;
  model.reducers.STATE_CLEAR = (state, {}) => state.initialStateBackup;
  return model;
}
