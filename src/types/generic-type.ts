export type ApiValidationError = { message: string; path: string }

export type ApiNormalResponse = {
  success: boolean
  message: string
  timestamp: string
  errors: ApiValidationError[]
}

export type TableConfigType = {
  search: boolean
  searchPlaceholder?: string
}

export type PaginationStateType = {
  pageSize: number
  pageIndex: number
}
