class ErrNotFound extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ErrNotFound.prototype);
  }
}

export default {
  ErrNotFound: ErrNotFound,
}
