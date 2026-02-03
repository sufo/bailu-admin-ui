<template>
  <n-button v-if="!action.popConfirm" v-bind="action">
    <template #icon v-if="action.icon">
      <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }"/>
    </template> 
    <template v-if="action.label">{{ action.label }}</template>
  </n-button>
  <n-popconfirm v-else v-bind="bindProps">
    <!--message: popconfrim content-->
    <!-- <template v-if="bindProps.message">{{ bindProps.message }}</template> -->
    <!-- <template v-for="(_, name) in $slots" v-slot:[name]="scope" :key="name">
      <slot :name="name" v-bind="scope||{}"/>
    </template> -->
    <!-- <template v-for="(_, name) in $slots" v-slot:[name.toString().split('-')[1]]="scope" :key="name">
      <slot :name="name" v-bind="scope||{}"/>
    </template> -->

    <template #action><slot name="popAction" /></template>
    <template #icon><slot name="popIcon" /></template>
    <template #default><slot name="popContent" >{{bindProps.message}}</slot></template>
    <template #trigger>
      <n-button v-bind="action">
        <template #icon v-if="action.icon">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }"/>
        </template> 
        <template v-if="action.label">{{ action.label }}</template>
      </n-button>
    </template>
  </n-popconfirm>
</template>

<script setup lang="ts">
import { actionItem } from './types';
import {useI18n} from 'vue-i18n';

/**
 * slots pop-action->action
 *       pop-default->default
 *       pop-icon -> icon
*/
defineOptions({name: 'PopButton'})
const {t} = useI18n()
const attrs = useAttrs()
const action = defineProps(actionItem);
//定义slot
const slots = defineSlots<{
  ['popContent']: (props: Recordable)=>any,
  ['popAction']: (props: Recordable)=>any,
  ['popIcon']: (props: Recordable)=>any,
}>()

const bindProps = computed(()=>{
  return Object.assign(
    {
      positiveText: t('button.okText'),
      negativeText: t('button.cancelText'),
      // onNegativeClick: ()=>{bindProps.value.show=false}
    },
    { ...action.popConfirm, ...unref(attrs) },
  );
})

</script>