import { Table, SortBy } from './interfaces';
import { Activity } from '../../common/interfaces';

export interface ModelProps {
  modelValue: boolean;
}

export interface SubmitFormProps {
  submitLoading: boolean;
  formId: string;
  showIndicatesRequiredField?: boolean;
}

export interface ItemsListProps {
  table: Table;
}

export interface ItemsManagerProps extends ItemsListProps, ModelProps, SubmitFormProps {
  addItemTitle: string;
  title: string;
  noDataText: string;
  sortBy: SortBy[];
  addButton: boolean;
  deleteDisabled: boolean;
  addDialog?: boolean;
}

export interface ItemsListManagerProps extends ModelProps, SubmitFormProps {
  addItemTitle: string;
  title: string;
  noDataText?: string;
  items: readonly any[];
  addDialog?: boolean;
}

export interface AddDialogProps extends ModelProps, SubmitFormProps {
  addItemTitle: string;
  maxWidth?: number;
}

export interface MsgSnackbarProps extends ModelProps {
  timeout: number;
  msg: string;
  icon: string;
  color?: string;
}

export interface ListItemProps {
  title: string;
  subtitle: string;
  icon: string;
  iconColor?: string;
}

export interface TitledCardProps {
  title: string;
  icon: string;
}

export interface CardItemProps extends TitledCardProps {
  tooltipText?: string;
  tooltipLocation?: string;
}

export interface AddCourseActivityProps extends SubmitFormProps {
  activity: Activity;
}
