import { Table, SortBy } from './interfaces';
import { Activity } from '../../common/interfaces';
import { Event } from './interfaces';

export interface ModelProps {
  modelValue?: boolean;
}

export interface ModelNumberProps {
  modelValue?: number;
}

export interface SubmitFormNoLoadProps {
  formId?: string;
  showIndicatesRequiredField?: boolean;
}

export interface SubmitFormProps extends SubmitFormNoLoadProps {
  submitLoading?: boolean;
}

export interface ItemsListProps {
  table: Table;
}

export interface ItemsManagerProps extends ItemsListProps, ModelProps, SubmitFormProps {
  addItemTitle?: string;
  title?: string;
  noDataText?: string;
  sortBy: SortBy[];
  deleteDisabled?: boolean;
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
  submitBtnText?: string;
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
  tooltipLocation?: string;
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

export interface AddScheduleStepperProps {
  addScheduleFormId?: string;
  submitScheduleFormId?: string;
}

export interface KeyValueTooltipProps {
  object: any;
}

export interface ScheduleXCalendarProps {
  defaultView?: string;
  withPagination?: boolean;
  events: Event[];
}

export interface SessionViewerProps extends ScheduleXCalendarProps {}
