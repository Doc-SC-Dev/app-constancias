export enum Actions {
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
  ADD = "add",
  DOWNLOAD = "download",
  UPDATE_STATE = "update-state",
  VIEW_REASON = "view-reason",
}

export type Action = (typeof Actions)[keyof typeof Actions];
