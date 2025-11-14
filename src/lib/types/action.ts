export enum Actions {
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
}

export type Action = (typeof Actions)[keyof typeof Actions];
