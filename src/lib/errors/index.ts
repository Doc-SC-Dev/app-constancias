export class DisconectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DisconectedError";
  }
}

export class DuplicatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicatedError";
  }
}

export class UnhandledPrismaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnhandledPrismaError";
  }
}

export class UnhandledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnhandledError";
  }
}
