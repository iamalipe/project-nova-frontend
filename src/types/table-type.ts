export type TablePagination = {
  page: number; // Optional page number
  limit: number; // Optional limit per page
};

export type TableSort<T> = {
  orderBy: keyof T; // Can be a key of T or any other string
  order: "asc" | "desc"; // Optional order direction
};

export type TableColumns<T> = {
  key: keyof T;
  label: string;
  toggleVisibility?: boolean; // default is true
  sortable?: boolean; // default is true
};