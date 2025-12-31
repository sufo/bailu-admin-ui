<template>
  <n-radio-group v-model:value="radioVal" :size="preference.theme.size">
    <n-space :size="20" vertical>
    <n-radio value="1">周，允许的通配符[, - * ? / L #]</n-radio>
    <n-radio value="2">不指定</n-radio>
    <n-radio value="3">周期从星期
      <n-select v-model:value="cycle01" :options="weekList" :disabled="cycle01==1"/> - 
      <n-select v-model:value="cycle02" :options="weekList" :disabled="cycle02<cycle01&&cycle02!=1"/>
    </n-radio>
    <n-radio value="4">
      第<n-input-number :min="1" :max="30" button-placement="both" v-model:value="startWeek" /> 周星期
      <n-select v-model:value="dayOfWeek" :options="weekList"/>
    </n-radio>
    <n-radio value="5">
      本月最后一个星期<n-select v-model:value="dayOfLastWeek" :options="weekList"/>
    </n-radio>
    <n-radio value="6">指定
      <span class="flex-1" @click="e=>{e.preventDefault();e.stopPropagation();}">
        <n-select clearable v-model:value="assignList" multiple :options="weekList"></n-select>
      </span>
    </n-radio>
    </n-space>
  </n-radio-group>
</template>
  
<script setup lang="ts">
import { usePreferenceStore } from "@/store/modules";
import { useI18n } from "vue-i18n";
import { isInteger } from "lodash-es";
import { CommonProps,Emits} from "./use-crontab";
  defineOptions({name:'CrontabWeek'})

  const props = defineProps<CommonProps>();
  const emits = defineEmits<Emits>();
  const {t} = useI18n()
  const weekList = [
		{key: 2,value: t('dt.week.mon')},
		{key: 3,value: t('dt.week.tue')},
    {key: 4,value: t('dt.week.wed')},
		{key: 5,value: t('dt.week.thu')},
    {key: 6,value: t('dt.week.fri')},
    {key: 7,value: t('dt.week.sat')},
		{key: 1,value: t('dt.week.sun')},
	];
  const preference = usePreferenceStore();
  const radioVal=ref('?'),cycle01 = ref(2),cycle02 = ref(3),
    startWeek=ref(1), dayOfWeek=ref(2),dayOfLastWeek=ref(2),
    assignList=ref<Array<string|number>>([]);
  
//初始化页面数据  
(function resolve(){
  const value = props.cron['week']
  if (value === "*") {
    radioVal.value = '1';
  } else if (value == "?") {
    radioVal.value = '2';
  } else if (value.indexOf("-") > -1) {
    let arr = value.split("-");
    isInteger(arr[0])&&(cycle01.value=parseInt(arr[0]));   
    cycle02.value=parseInt(arr[0])
    radioVal.value = '3';
  } else if (value.indexOf("#") > -1) {
    let arr = value.split("#");
    isInteger(arr[0])&&(startWeek.value=parseInt(arr[0]));    
    dayOfWeek.value = parseInt(arr[1]);
    radioVal.value = '4';
  } else if (value === "L") {
    let arr = value.split("#");
    isInteger(arr[0])&&(dayOfLastWeek.value=parseInt(arr[0]));    
    radioVal.value = '5';
  } else {
    assignList.value = value.split(",");
    radioVal.value = '6';
  }
})()


  const week = computed(()=>{
    switch (radioVal.value) {
      case "1":
        return '*'
      case "2":
        return '?';
      case "3":
        return cycle01.value + '-' + cycle02.value;
      case "4":
        return dayOfWeek.value + "#" + startWeek.value;
      case "5":
        return dayOfLastWeek.value+"L";
      case "6":
        const str = assignList.value.join()
        return str==''?'*':str;
    }
  })
  
  
  watch(week,
    newVal=>{
      if(radioVal.value !=='2' && props.cron.day !=='?'){
        emits("update:value",'day', "?")
      }
      emits("update:value",'week',newVal)
    }
  )
  </script>
  