export enum Align {
  START = 'start',
  END = 'end',
}

export interface Header {
  title: string,
  key: string,
  align: Align,
  sortable: boolean,
}

export interface Table {
  header: Header[],
  rows: Record<string, string>[],
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
