<template>
  <n-radio-group v-model:value="radioVal" :size="preference.theme.size">
    <n-space :size="20" vertical>
    <n-radio value="1">不填，允许的通配符[, - * /]</n-radio>
    <n-radio value="2">每年</n-radio>
    <n-radio value="3">周期从
      <n-input-number :min="curYear" :max="2098" button-placement="both" v-model:value="cycle01" /> - 
      <n-input-number :min="cycle01 ? cycle01 + 1 : curYear+1" :max="2099" button-placement="both" v-model:value="cycle02" />日
    </n-radio>
    <n-radio value="4">
      从<n-input-number :min="curYear" :max="2098" button-placement="both" v-model:value="startYear" /> 年开始，每
      <n-input-number :min="1" :max="2099-startYear||curYear" button-placement="both" v-model:value="interval" /> 年执行一次
    </n-radio>
    <n-radio value="5">指定
      <span class="flex-1" @click="e=>{e.preventDefault();e.stopPropagation();}">
        <n-select clearable v-model:value="assignList" multiple :options="options"></n-select>
      </span>
    </n-radio>
    </n-space>
  </n-radio-group>
  </template>
  
<script setup lang="ts">
import { usePreferenceStore } from "@/store/modules";
import {isInteger} from 'lodash-es'
import { CommonProps,Emits} from "./use-crontab";
  defineOptions({name:'CronYear'})

  const preference = usePreferenceStore();
  const props = defineProps<CommonProps>();
  const emits = defineEmits<Emits>();

  const curYear = new Date().getFullYear(),
    radioVal=ref(''),
    cycle01 = ref(curYear),cycle02 = ref(0),
    startYear=ref(curYear), interval=ref(1),
    assignList=ref<Array<string|number>>([]);

  const options:Ref<OptionWithKey<number>[]> = ref([])
  let i = 0
  
  while(i < 9){
    options.value.push({label:i+curYear+'', value:i+curYear})
    i++;
  }

//初始化页面数据  
(function resolve(){
  const value = props.cron['year']
  if (value === "*") {
    radioVal.value = '1';
  } else if (value == "?") {
    radioVal.value = '2';
  } else if (value.indexOf("-") > -1) {
    let arr = value.split("-");
    isInteger(arr[0])&&(cycle01.value=parseInt(arr[0]));   
    cycle02.value=parseInt(arr[0])
    radioVal.value = '3';
  } else {
    assignList.value = value.split(",");
    radioVal.value = '6';
  }
})()

  const year = computed(()=>{
    switch (radioVal.value) {
      case "1":
        return '';
      case "2":
        return "*"
      case "3":
        return cycle01.value + '-' + cycle02.value;
      case "4":
        return startYear.value + '/' + interval.value;
      case "5":
        const str = assignList.value.join()
        return str;
    }
  })
  
  watch(year,
    newVal=>emits("update:value",'year',newVal),
  )
  </script>
  