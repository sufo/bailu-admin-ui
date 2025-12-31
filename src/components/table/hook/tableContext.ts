import { TableContext } from "../types";

const key = Symbol('d-table')


export function provideTableCtx(context: TableContext) {
  provide(key, context);
}

export function useTableContext():TableContext{
  return inject(key) as TableContext
}