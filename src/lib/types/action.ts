export enum Actions {
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
  ADD = "add",
  DOWNLOAD = "download",
}

export type Action = (typeof Actions)[keyof typeof Actions];
