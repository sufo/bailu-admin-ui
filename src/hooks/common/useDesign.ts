
import { useContext } from "@/store/useContext"
export function useDesign(scope: string) {
  const ctx = useContext()
  return {
    prefixCls: `${ctx.prefixCls}-${scope}`,
    prefix: ctx.prefixCls
  }
}