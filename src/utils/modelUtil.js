/**
 * model合并
 * @param models model对象数组
 * @returns {*}
 */
export function combine(models) {
  return models.reduce(function(prev, cur) {
    return {
      state: { ...prev.state, ...cur.state },
      effects: { ...prev.effects, ...cur.effects },
      reducers: { ...prev.reducers, ...cur.reducers },
      subscriptions: { ...prev.subscriptions, ...cur.subscriptions },
    };
  });
}
