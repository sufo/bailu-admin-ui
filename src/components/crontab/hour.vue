<template>
  <n-radio-group v-model:value="radioVal" :size="preference.theme.size">
    <n-space :size="20" vertical>
    <n-radio value="1">小时，允许的通配符[, - * /]</n-radio>
    <n-radio value="2">周期从
      <n-input-number :min="0" :max="22" button-placement="both" v-model:value="cycle01" /> - 
      <n-input-number :min="cycle01 ? cycle01 + 1 : 1" :max="23" button-placement="both" v-model:value="cycle02" />小时
    </n-radio>
    <n-radio value="3">
      从<n-input-number :min="0" :max="22" button-placement="both" v-model:value="start" /> 小时开始，每
      <n-input-number :min="1" :max="23-start||0" button-placement="both" v-model:value="interval" />小时执行一次
    </n-radio>
    
    <n-radio value="4">指定
      <span class="flex-1" @click="e=>{e.preventDefault();e.stopPropagation();}">
        <n-select clearable v-model:value="assignList" multiple :options="options"></n-select>
      </span>
    </n-radio>
    </n-space>
  </n-radio-group>
</template>
  
<script setup lang="ts">
import { usePreferenceStore } from "@/store/modules";
import { useCrontab } from "./use-crontab";
import { CommonProps,Emits} from "./use-crontab";
defineOptions({name:'CronHour'})
const preference = usePreferenceStore();
const props = defineProps<CommonProps>();
const emits = defineEmits<Emits>();

const value = ref(props.cron['hour'])
const { resolve } = useCrontab('hour', value.value)

const radioVal=ref('1'),cycle01 = ref(0),cycle02 = ref(1),
  start=ref(0), interval=ref(1),
  assignList=ref<Array<string|number>>([]);

const options:Ref<OptionWithKey<number>[]> = ref([])
let i = 0
while(i < 25){
  options.value.push({label:i+'', value:i})
  i++;
}

//初始化页面数据  
resolve(radioVal,cycle01,cycle02,start,interval,assignList)


const hour = computed(()=>{
  switch (radioVal.value) {
    case "1":
      return "*"
    case "2":
      return cycle01.value + '-' + cycle02.value;
    case "3":
      return start.value + '/' + interval.value;
    case "4":
      const str = assignList.value.join()
      return str==''?'*':str;
  }
})

watch(hour,
  newVal=>emits("update:value",'hour',newVal),
)
</script>
  