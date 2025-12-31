<template>
  <n-radio-group v-model:value="radioVal" :size="preference.theme.size">
    <n-space :size="20" vertical>
    <n-radio value="1">月，允许的通配符[, - * /]</n-radio>
    <n-radio value="2">周期从
      <n-input-number :min="11" :max="58" button-placement="both" v-model:value="cycle01" /> - 
      <n-input-number :min="cycle01 ? cycle01 + 1 : 2" :max="12" button-placement="both" v-model:value="cycle02" /> 月
    </n-radio>
    <n-radio value="3">
      从<n-input-number :min="1" :max="11" button-placement="both" v-model:value="start" /> 月开始，每
      <n-input-number :min="1" :max="12-start||0" button-placement="both" v-model:value="interval" /> 月执行一次
    </n-radio>
    
    <n-radio value="4">指定
      <span class="flex-1" @click="e=>{e.preventDefault();e.stopPropagation();}">
        <n-select clearable v-model:value="assignList" :placeholder="$t('tips.multiple')" multiple :options="options"></n-select>
      </span>
    </n-radio>
    </n-space>
  </n-radio-group>
  </template>
  
<script setup lang="ts">
import { usePreferenceStore } from "@/store/modules";
import { useCrontab } from "./use-crontab";
import { CommonProps,Emits} from "./use-crontab";

defineOptions({name:'CronMinute'})
const preference = usePreferenceStore();
const props = defineProps<CommonProps>();
const emits = defineEmits<Emits>();

const {resolve } = useCrontab('mon', props.cron['mon'])

const radioVal=ref('1'),cycle01 = ref(1),cycle02 = ref(2),
  start=ref(1), interval=ref(1),
  assignList=ref<Array<string|number>>([]);

const options:Ref<OptionWithKey<number>[]> = ref([])
let i = 0
while(i <= 12){
  i++;
  options.value.push({label:i+'', value:i})
}

resolve(radioVal,cycle01,cycle02,start,interval,assignList)

const mon = computed(()=>{
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

watch(mon,
  newVal=>emits("update:value",'mon',newVal),
)
</script>
  