<template>
<div class="relative" :class="prefixCls">
  <div class="scroll-wrap">
    <n-tabs type="segment" animated>
      <n-tab-pane v-for="t in tabs" :name="t.name" :tab="t.tab" >
        <component :is="t.component" @update:value="updateValue" :cron="cronMap"/>
      </n-tab-pane>
    </n-tabs>
    <div class="relative mt-20px p-20px [border:1px_solid_#ccc] dark:border-#707070">
      <div class="color-#707070 absolute top-0 px-20px bg-white dark:bg-[var(--n-color)] left-1/2 transform -translate-x-1/2 -translate-y-1/2"> 
        {{ $t('page.task.timeExpression') }}
      </div>
      <table class="cron-table" cellspacing="5">
        <thead><th v-for="t in tabs" :key="t.name">{{ t.tab }}</th><th>{{ $t('page.task.cron') }}</th></thead>
        <tbody>
          <tr><td v-for="(value,key) of cronMap" :key="key">{{ value }}</td><td>{{ cronExpression }}</td></tr>
        </tbody>
      </table>
    </div>
    <cron-result :ex="cronExpression"></cron-result>
    </div>
    <div class="button-wrap absolute right-0 bottom-[-10px] left-0 flex-center gap-10px">
      <n-button :size="preference.theme.size" ghost type="primary" @click="onConfirm">{{ t('button.confirm') }}</n-button>
      <n-button :size="preference.theme.size"  ghost type="warning" @click="onRest">{{ t('button.resetText') }}</n-button>
      <n-button :size="preference.theme.size" @click="close()">{{ t('button.cancelText') }}</n-button>
    </div>
</div>
</template>
<script setup lang="ts">
import CronSecond from './sec.vue'
import CronMinute from './min.vue'
import CronHour from './hour.vue'
import CronDay from './day.vue'
import CronMonth from './month.vue'
import CronWeek from './week.vue'
import CronYear from './year.vue'
import CronResult from './result.vue'
import { useI18n } from 'vue-i18n'
import { crontabProps,ConsistKey} from './use-crontab'
import { usePreferenceStore } from '@/store/modules'
import { useDesign } from '@/hooks'

defineOptions({name: 'Crontab'})

const {t} = useI18n()
const preference = usePreferenceStore()
const {prefixCls} = useDesign('crontab')
const tabs = [
  {name:'sec', component:CronSecond, tab:t('dt.sec')},
  {name:'min', component:CronMinute, tab:t('dt.min')},
  {name:'hour', component:CronHour, tab:t('dt.hour')},
  {name:'day', component:CronDay, tab:t('dt.day')},
  {name:'mon', component:CronMonth, tab:t('dt.mon')},
  {name:'week', component:CronWeek, tab:t('dt.week.label')},
  {name:'year', component:CronYear, tab:t('dt.year')},
]

const props = defineProps(crontabProps)

const cronMap:Ref<Record<ConsistKey,string>> = ref({sec: "*",min: "*",hour: "*",day: "*",mon: "*",week: "?",year: "",})

// const cronMap:ComputedRef<Record<ConsistKey,string>> = computed(()=>{
//   let arr = props.expression.split(" ");
//   if (arr.length >= 6) {
//     //6 位以上是合法表达式
//     return {
//       sec: arr[0],
//       min: arr[1],
//       hour: arr[2],
//       day: arr[3],
//       mon: arr[4],
//       week: arr[5],
//       year: arr[6] ? arr[6] : "",
//     };
//   }else return {sec: "*",min: "*",hour: "*",day: "*",mon: "*",week: "?",year: "",}
// })
function resolveExp(){
  if(props.expression){
    let arr = props.expression.split(" ");
    if (arr.length >= 6) {
      //6 位以上是合法表达式
      cronMap.value = {
        sec: arr[0],
        min: arr[1],
        hour: arr[2],
        day: arr[3],
        mon: arr[4],
        week: arr[5],
        year: arr[6] ? arr[6] : "",
      };
    }
  }
}

const cronExpression = computed(()=>{
  const c = unref(cronMap)
  return `${c.sec} ${c.min} ${c.hour} ${c.day} ${c.mon} ${c.week}${c.year==''?'':' '+c.year}`
})

function updateValue(name:ConsistKey, val:string){
  cronMap.value[name] = val
}

function onConfirm(){
  props.onFill?.(cronExpression.value)
}
function onRest(){
  cronMap.value={sec: "*",min: "*",hour: "*",day: "*",mon: "*",week: "?",year: "",}
}
function close(){
  props.onClose?.()
}

//调用初始化
resolveExp()
</script>

<style lang="scss">
$prefix: '#{$namespace}-crontab';
.#{$prefix}{
  height: 70vh;
  position: relative;
  .scroll-wrap{
    height: calc(100% - 30px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .n-tabs{
    border: 1px solid #dcdfe6;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    .n-tab-pane{padding:15px;}
  }

  .n-radio{align-items: center; width:100%;
    >.n-radio__label{flex:1;}
    .n-radio__label{display:flex;flex-wrap:nowrap;z-index:2;align-items:center;white-space:nowrap;
      .n-input-number{width:110px;height:32px;padding:0 4px;}
      .n-select{padding:0 4px;}
    }
  }
  .n-radio--checked{color:var(--n-dot-color-active);
    .n-radio__label{color:var(--n-dot-color-active);}
  }
  .cron-table{
    width:100%;
    border-collapse: separate; //table边框和td边框合并
    border-spacing: 2px; //border-collapse: separate才有效,如果border-collapse设置为collapse，则边框之间不会有任何空间。
    text-align:center;
    th{width:40px;/*no*/white-space:nowrap;height:40px;}
    td{border:var(--n-border);height:30px;}
  }
} 
.dark{
  .#{$prefix}{
    .n-tabs{
      border: 1px solid #707070;
    }
  }
}
</style>