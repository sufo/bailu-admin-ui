<template>
<n-radio-group v-model:value="radioVal" :size="perference.theme.size">
  <n-space vertical>
  <n-radio value="1">日，允许的通配符[, - * ? / L W]</n-radio>
  <n-radio value="2">不指定</n-radio>
  <n-radio value="3">周期从
    <n-input-number :min="1" :max="30" button-placement="both" v-model:value="cycle01" /> - 
    <n-input-number :min="cycle01 ? cycle01 + 1 : 2" :max="31" button-placement="both" v-model:value="cycle02" />日
  </n-radio>
  <n-radio value="4">
    从<n-input-number :min="1" :max="30" button-placement="both" v-model:value="startDay" /> 号开始，每
    <n-input-number :min="1" :max="31-startDay||1" button-placement="both" v-model:value="interval" />日执行一次
  </n-radio>
  <n-radio value="5">
    每月<n-input-number :min="1" :max="30" button-placement="both" v-model:value="workday" /> 号最近那个工作日
  </n-radio>
  <n-radio value="6">本月最后一天</n-radio>
  <n-radio value="7">指定
    <span class="flex-1" @click="e=>{e.preventDefault();e.stopPropagation();}">
      <n-select clearable v-model:value="assignList" multiple :options="options"></n-select>
    </span>
  </n-radio>
  </n-space>
</n-radio-group>
</template>

<script setup lang="ts">
import { usePreferenceStore } from "@/store/modules";
import { isInteger } from "lodash-es";
import { CommonProps,Emits} from "./use-crontab";
defineOptions({name:'CronDay'})
const perference = usePreferenceStore();

const props = defineProps<CommonProps>();
const emits = defineEmits<Emits>();

const value = ref(props.cron['day'])


const radioVal=ref('1'),cycle01 = ref(1),cycle02 = ref(2),
  startDay=ref(1), interval=ref(1),workday=ref(1),
  assignList=ref<Array<string|number>>([]);

//初始化页面数据  
(function resolve(){
  const _val = value.value
  if (_val === "*") {
    radioVal.value = '1';
  } else if (_val == "?") {
    radioVal.value = '2';
  } else if (_val.indexOf("-") > -1) {
    let arr = _val.split("-");
    if(isInteger(arr[0])){
      cycle01.value=parseInt(arr[0]);
    }
    cycle02.value=parseInt(arr[1]);   
    radioVal.value = '3';
  } else if (_val.indexOf("/") > -1) {
    let arr = _val.split("/");
    if(isInteger(arr[0])){
      startDay.value=parseInt(arr[0])
    };    
    interval.value = parseInt(arr[1]);
    radioVal.value = '4';
  } else if (_val.indexOf("W") > -1) {
    let arr = _val.split("W");
    if(isInteger(arr[0])){
      workday.value=parseInt(arr[0])
    };
    radioVal.value = '5';
  } else if (_val === "L") {
    radioVal.value = '6';
  } else {
    assignList.value = _val.split(",");
    radioVal.value = '7';
  }
})()

const options:Ref<OptionWithKey<number>[]> = ref([])
let i = 0
while(i < 31){
  i++;
  options.value.push({label:i+'', value:i})
}

const day = computed(()=>{
  switch (radioVal.value) {
    case "1":
      return "*"
    case "2":
      return "?"
    case "3":
			return cycle01.value + '-' + cycle02.value;
    case "4":
      return startDay.value + '/' + interval.value;
    case "5":
      return workday.value+"W";
    case "6":
      return "L"
    case "7":
      const str = assignList.value.join()
      return str==''?'*':str;
  }
})

watch(day,
  newVal=>emits("update:value",'day',newVal),
)
</script>
