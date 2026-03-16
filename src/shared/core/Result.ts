export type SerializedResult<T, E> =
  | {
      isSuccess: true;
      value: T;
      error: undefined;
    }
  | {
      isSuccess: false;
      value: undefined;
      error: E;
    };

export type Result<T, E> = Ok<T, E> | Err<T, E>;

class Ok<T, E> {
  public readonly isSuccess = true as const;
  public readonly value: T;
  public readonly error = undefined;

  public constructor(value: T) {
    this.value = value;
  }

  public get getValue(): T {
    return this.value;
  }

  public get getError(): E {
    throw new Error("Fue un resultado exitoso");
  }

  public serialize(): SerializedResult<T, E> {
    return {
      isSuccess: true,
      value: this.value,
      error: undefined,
    };
  }

  public toJSON(): SerializedResult<T, E> {
    return this.serialize();
  }
}

class Err<T, E> {
  public readonly isSuccess = false as const;
  public readonly value = undefined;
  public readonly error: E;

  public constructor(error: E) {
    this.error = error;
  }

  public get getValue(): T {
    throw new Error("No es un resultado exitoso");
  }

  public get getError(): E {
    return this.error;
  }

  public serialize(): SerializedResult<T, E> {
    return {
      isSuccess: false,
      value: undefined,
      error: this.error,
    };
  }

  public toJSON(): SerializedResult<T, E> {
    return this.serialize();
  }
}

function ok<T, E = never>(value: T): Result<T, E>;
function ok<E = never>(): Result<void, E>;
function ok(value?: unknown): Result<unknown, unknown> {
  return new Ok(value as unknown);
}

function fail<T = never, E = unknown>(error: E): Result<T, E> {
  return new Err(error);
}

export const Result = { ok, fail } as const;
