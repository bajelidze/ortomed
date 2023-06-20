// ErrNotFound is an error that occurs when
// something is not found.
class ErrNotFound extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ErrNotFound.prototype);
  }
}

// ErrDBNotSet is an error that occurs when
// the database is not set (initialized or specified).
class ErrDBNotSet extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ErrDBNotSet.prototype);
  }
}

export default {
  ErrNotFound: ErrNotFound,
  ErrDBNotSet: ErrDBNotSet,
};
