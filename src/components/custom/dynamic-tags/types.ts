export interface TagOption{
  label: string;
  value: string;
  isEdit?: boolean;
}

export interface DynamicTagProps {
  closable?: boolean;   //是否可关闭
  canCreate?:boolean;  //是否有添加按钮
  // color?:{
  //   color?:string;
  //   borderColor?:string;
  //   textColor?:string;
  // },
  disabled?:boolean;  //添加按钮是否可用
  max?:number;
  size?: 'small' | 'medium' | 'large';
  tagClass?:string;
  tagStyle?:string;
  type?:'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
  value: TagOption[];
  onUpdateValue?:((value: string[]) => void) | ((value: TagOption[]) => void);
  'onUpdate:value'?:((value: string[]) => void) | ((value: TagOption[]) => void);
  onSave?: (label: TagOption|string) => (TagOption|Promise<TagOption>);
  onRemove?: (tag:TagOption,index:number) => void;
  onItemClick?: (tag:TagOption) => void;
  onChange?: (tag:TagOption) => void;
  contextMenu?: import('@/components/custom/context-menu/types').ContextMenuProp;
}