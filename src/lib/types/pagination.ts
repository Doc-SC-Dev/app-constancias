export type PaginationResponse<T> = {
  data: T[];
  nextPage: number;
  totalRows: number;
};

export const PAGE_SIZE = 10;
