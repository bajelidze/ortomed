import { Table } from './interfaces';

export interface ItemsListProps {
  table: Table
}

export interface ItemsManagerProps extends ItemsListProps {
  title: string
  addButton: boolean
}
