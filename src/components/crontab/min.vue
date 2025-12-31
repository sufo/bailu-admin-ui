<template>
  <n-radio-group v-model:value="radioVal" :size="preference.theme.size">
    <n-space :size="20" vertical>
    <n-radio value="1">分钟，允许的通配符[, - * /]</n-radio>
    <n-radio value="2">周期从
      <n-input-number :min="0" :max="58" button-placement="both" v-model:value="cycle01" /> - 
      <n-input-number :min="cycle01 ? cycle01 + 1 : 1" :max="59" button-placement="both" v-model:value="cycle02" />分钟
    </n-radio>
    <n-radio value="3">
      从<n-input-number :min="0" :max="58" button-placement="both" v-model:value="start" /> 分钟开始，每
      <n-input-number :min="1" :max="59-start||0" button-placement="both" v-model:value="interval" />分钟执行一次
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

defineOptions({name:'CronMinute'})
const preference = usePreferenceStore();

const props = defineProps<CommonProps>();
const emits = defineEmits<Emits>();

const {resolve} = useCrontab('min', props.cron['min'])

const radioVal=ref('1'),cycle01 = ref(1),cycle02 = ref(2),
  start=ref(0), interval=ref(1),
  assignList=ref<Array<string|number>>([]);

const options:Ref<OptionWithKey<number>[]> = ref([])
let i = 0
while(i < 60){
  options.value.push({label:i+'', value:i})
  i++;
}

resolve(radioVal,cycle01,cycle02,start,interval,assignList)

const minute = computed(()=>{
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

watch(minute,
  newVal=>emits("update:value",'min',newVal),
)
</script>
  