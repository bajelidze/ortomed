type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

// NFP returns a new type that has only the public
// fields of the passed type.
export type NFP<T> = Pick<T, NonFunctionPropertyNames<T>>;
