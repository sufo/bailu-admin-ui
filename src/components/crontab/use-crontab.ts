import { isInteger } from "lodash-es";

export type ConsistKey = 'sec'|'min'|'hour'|'day'|'mon'|'week'|'year'


export interface CrontabProps{
  expression: string  //cron表达式
  onClose?: ()=>void,  //cron关闭
  onFill?: (value:string)=>void //确定返回值
}

// crontab props
export const crontabProps = {
  // expression: {
  //   type: Object as PropType<Record<ConsistKey,string>>, 
  //   default:{second: "*",min: "*",hour: "*",day: "*",month: "*",week: "?",year: "",}
  // },
  expression:{type:String as PropType<string>, default:"* * * * * ?"},
  onClose:{type: Function as PropType<()=>void>},
  onFill:{type: Function as PropType<(value:string)=>void>}
}

export interface CommonProps{
  cron: Record<ConsistKey, string>
}

export interface Emits{
  (e: 'update:value',name:string, val:string|undefined):void
}

//name 组件名称
export function useCrontab(name:ConsistKey, value:string){
  //无法使用
  // const props = defineProps<CommonProps>();
  // const emits = defineEmits<Emits>();

  //sec min hour mon 解析使用
  function resolve(radioVal:Ref<string>,cycle01:Ref<number>, 
    cycle02: Ref<number>,start: Ref<number>, interval: Ref<number>, 
    assignList:Ref<Array<string|number>>
  ){
    if (value === "*") {
      radioVal.value = '1';
    } else if (value.indexOf("-") > -1) {
      let arr = value.split("-");
      if(isInteger(arr[0])){
        cycle01.value=parseInt(arr[0]);
      }
      cycle02.value = parseInt(arr[1])  
      radioVal.value = '2';
    } else if (value.indexOf("/") > -1) {
      let arr = value.split("/");
      if(isInteger(arr[0])){start.value=parseInt(arr[0])};    
      interval.value = parseInt(arr[1]);
      radioVal.value = '3';
    } else {
      assignList.value = value.split(",");
      radioVal.value = '4';
    }
  }
  
  return {
    resolve
  }

}