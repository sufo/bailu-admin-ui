const key = Symbol('d-form')

export function provideFormCtx(ctx:any){
  provide(key, ctx)
}

export function useFormContext(){
  return inject(key)
}