import { TagOption } from "../dynamic-tags/types"

export interface ContextMenuProp {
  show: boolean
  actions?: Array<ContextAction>
  e?:MouseEvent,
  onClickOutside?:(e: MouseEvent) => void
}


export interface ContextAction {
  disabled?: boolean,
  action: string,
  label: string,
  //返回值 true则关闭context menu
  handler:(tag?: TagOption)=>Promise<boolean>|boolean
}