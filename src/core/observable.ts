type Subscriber<T> = (value: T, prev: T) => void;

export class Observable<T> {
  private _value: T;
  private _subscribers = new Set<Subscriber<T>>();

  constructor(initial: T) {
    this._value = initial;
  }

  get value(): T {
    return this._value;
  }

  set value(next: T) {
    if (next === this._value) return;
    const prev = this._value;
    this._value = next;
    this._subscribers.forEach((fn) => fn(next, prev));
  }

  /** Subscribe to value changes. Returns an unsubscribe function. */
  subscribe(fn: Subscriber<T>): () => void {
    this._subscribers.add(fn);
    return () => this._subscribers.delete(fn);
  }

  /** Create a derived observable that transforms this observable's value. */
  pipe<U>(transform: (val: T) => U): Observable<U> {
    const derived = new Observable<U>(transform(this._value));
    this.subscribe((val) => {
      derived.value = transform(val);
    });
    return derived;
  }
}

/**
 * Create a computed observable whose value is re-derived whenever any
 * dependency emits a new value.
 */
export function computed<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: Observable<any>[],
  fn: () => T,
): Observable<T> {
  const obs = new Observable<T>(fn());
  deps.forEach((dep) => dep.subscribe(() => { obs.value = fn(); }));
  return obs;
}
