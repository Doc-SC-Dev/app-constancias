export enum ActivityTypeErrorType {
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  HAS_RELATIONS = "HAS_RELATIONS",
  DATABASE_ERROR = "DATABASE_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export class ActivityTypeError {
  constructor(
    public readonly type: ActivityTypeErrorType,
    public readonly message: string,
  ) {}

  static notFound(message = "Tipo de actividad no encontrado") {
    return new ActivityTypeError(ActivityTypeErrorType.NOT_FOUND, message);
  }

  static alreadyExists(message = "El tipo de actividad ya existe") {
    return new ActivityTypeError(ActivityTypeErrorType.ALREADY_EXISTS, message);
  }

  static hasRelations(
    message = "No se puede realizar la acción debido a relaciones existentes",
  ) {
    return new ActivityTypeError(ActivityTypeErrorType.HAS_RELATIONS, message);
  }

  static databaseError(message = "Error en la base de datos") {
    return new ActivityTypeError(ActivityTypeErrorType.DATABASE_ERROR, message);
  }

  static validationError(message = "Error de validación") {
    return new ActivityTypeError(
      ActivityTypeErrorType.VALIDATION_ERROR,
      message,
    );
  }

  static unauthorized(message = "No autorizado") {
    return new ActivityTypeError(ActivityTypeErrorType.UNAUTHORIZED, message);
  }
}
