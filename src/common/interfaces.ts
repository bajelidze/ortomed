export enum Align {
  Start = 'start',
  End = 'end',
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
