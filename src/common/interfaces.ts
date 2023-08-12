export enum Align {
  START = 'start',
  END = 'end',
}

export interface Header {
  title: string
  key: string
  align: Align
  sortable: boolean
}

export type Row = Record<string, string>

export interface Table {
  header: Header[]
  rows?: Row[]
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortBy {
  key: string
  order: Order
}

export interface AddPatientFields {
  name: string
}
