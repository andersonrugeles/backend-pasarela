// shared/result.ts
export type Result<T, E> = Success<T> | Failure<E>;

export class Success<T> {
  constructor(public readonly value: T) {}
  isOk(): this is Success<T> {
    return true;
  }
  isErr(): this is Failure<any> {
    return false;
  }
}
export class Failure<E> {
  constructor(public readonly error: E) {}
  isOk(): this is Success<any> {
    return false;
  }
  isErr(): this is Failure<E> {
    return true;
  }
}

export const ok = <T>(value: T): Result<T, never> => new Success(value);
export const err = <E>(error: E): Result<never, E> => new Failure(error);
