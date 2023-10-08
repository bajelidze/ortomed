import { Table, SortBy } from './interfaces';

export interface ItemsListProps {
  table: Table;
}

export interface ItemsManagerProps extends ItemsListProps {
  title: string;
  addItemTitle: string;
  noDataText: string;
  sortBy: SortBy[];
  addButton: boolean;
  submitLoading: boolean;
  formId: string;
  modelValue: boolean;
  deleteDisabled: boolean;
}

export interface ItemsListManagerProps {
  title: string;
  addItemTitle: string;
  noDataText?: string;
  submitLoading: boolean;
  formId: string;
  modelValue: boolean;
  items: readonly any[];
  showIndicatesRequiredField: boolean;
}

export interface SubmitFormProps {
  formId: string;
  submitLoading: boolean;
}
