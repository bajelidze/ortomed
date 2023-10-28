import { Table, SortBy } from './interfaces';

export interface ModelProps {
  modelValue: boolean;
}

export interface ItemsListProps {
  table: Table;
}

export interface ItemsManagerProps extends ItemsListProps, ModelProps {
  title: string;
  addItemTitle: string;
  noDataText: string;
  sortBy: SortBy[];
  addButton: boolean;
  submitLoading: boolean;
  formId: string;
  deleteDisabled: boolean;
}

export interface ItemsListManagerProps extends ModelProps {
  title: string;
  addItemTitle: string;
  noDataText?: string;
  submitLoading: boolean;
  formId: string;
  items: readonly any[];
  showIndicatesRequiredField: boolean;
}

export interface SubmitFormProps {
  formId: string;
  submitLoading: boolean;
}

export interface MsgSnackbarProps extends ModelProps {
  timeout: number;
  msg: string;
  color?: string;
}
