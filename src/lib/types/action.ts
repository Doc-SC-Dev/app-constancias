export enum Actions {
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
  ADD = "add",
}

export type Action = (typeof Actions)[keyof typeof Actions];
