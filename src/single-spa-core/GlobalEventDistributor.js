export class GlobalEventDistributor {
  constructor() {
    this.stores = [];
  }

  registerStore(store) {
    this.stores.push(store);
  }

  dispatch(event) {
    this.stores.forEach(s => {
      s.dispatch(event);
      setTimeout(() => s.dispatch({ type: 'REFRESH' }));
    });
  }

  getState() {
    const state = {};
    this.stores.forEach(s => {
      const currentState = s.getState();
      state[currentState.namespace] = currentState;
    });
    return state;
  }
}
