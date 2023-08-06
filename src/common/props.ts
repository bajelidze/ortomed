import { Table, SortBy } from './interfaces';

export interface ItemsListProps {
  table: Table
}

export interface ItemsManagerProps extends ItemsListProps {
  title: string
  noDataText: string
  addPatientTitle: string
  sortBy: SortBy[]
  addButton: boolean
}
