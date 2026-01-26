export class Result<T, E> {
  private constructor(
    public isSuccess: boolean,
    private value?: T,
    private error?: E,
  ) {}
  static ok<U, F>(value?: U): Result<U, F> {
    return new Result<U, F>(true, value, undefined);
  }
  static fail<U, F>(error: F): Result<U, F> {
    return new Result<U, F>(false, undefined, error);
  }

  public get getValue() {
    if (!this.isSuccess || !this.value) {
      throw new Error("No es un resultado exitoso");
    }
    return this.value;
  }

  public get getError() {
    if (this.isSuccess || !this.error) {
      throw new Error("Fue un resultado exitoso");
    }
    return this.error;
  }
  serialize() {
    return {
      isSuccess: this.isSuccess,
      value: this.value,
      error: this.error,
    };
  }
}
