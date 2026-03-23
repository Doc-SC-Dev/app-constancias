export class AppError extends Error {
  public constructor(
    public message: string,
    public code: string,
  ) {
    super(message);
  }

  static validation(msg: string) {
    return new AppError(msg, "VALIDATION_ERROR");
  }
  static forbidden(msg: string = "Forbidden") {
    return new AppError(msg, "FORBIDDEN");
  }
  static notFound(msg: string) {
    return new AppError(msg, "NOT_FOUND");
  }
  static internal(msg: string) {
    return new AppError(msg, "INTERNAL_ERROR");
  }
}
