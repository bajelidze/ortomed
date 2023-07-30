interface Row {
  key: any,
  content: string[],
}

export interface Table {
  header: string[],
  rows: Row[],
}
