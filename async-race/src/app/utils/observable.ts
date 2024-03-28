function isCallable(fn: unknown): fn is CallableFunction {
  return typeof fn === 'function';
}
class Observable<ListenerType> {
  private value: ListenerType;

  private listeners: Array<(params: ListenerType) => void>;

  constructor(initialValue: ListenerType) {
    this.value = initialValue;
    this.listeners = [];
  }

  subscribe(listener: (params: ListenerType) => void): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: (params: ListenerType) => void): void {
    this.listeners = this.listeners.filter((elem) => elem !== listener);
  }

  notify(params: (previousValue: ListenerType) => ListenerType): void;
  notify(params: ListenerType): void;
  notify(
    params: ListenerType | (((previousValue: ListenerType) => ListenerType) & CallableFunction),
  ): void {
    if (isCallable(params)) {
      this.value = params(this.value);
    } else {
      this.value = params;
    }

    this.listeners.forEach((listener) => listener(this.value));
  }

  getValue(): ListenerType {
    return this.value;
  }
}

export default Observable;
