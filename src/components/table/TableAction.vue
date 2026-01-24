<template>
  <div :class="prefixCls" @click="onCellClick">
    <!--默认前置插槽-->
    <slot name="prefix"></slot>
    <n-divider vertical class="action-divider"
        v-if="$slots.prefix && $slots.prefix.length > 0"/>
    <template v-for="(action,index) in actions" :key="`${index}-${action.label}`">
      <template v-if="action.tooltip">
      <tool-tip v-bind="getTooltip(action.tooltip)">
        <pop-button v-bind="action">
          <!--传递插槽-->
          <template v-for="(_, name) in popSlots" v-slot:[name]="scope">
            <slot :name="name" v-bind="scope||{}"/>
          </template>
        </pop-button>
      </tool-tip>
      </template>
      <template v-else>
        <pop-button v-bind="action">
          <template v-for="(_, name) in popSlots" v-slot:[name]="scope">
            <slot :name="name" v-bind="scope||{}"/>
          </template>
        </pop-button>
      </template>
      <n-divider
        vertical
        class="action-divider"
        v-if="divider && index < actions.length - 1"/>
    </template>
    
    <n-divider vertical class="action-divider"
        v-if="dropdownProps.options&&dropdownProps.options.length>0"/>
      <!--这里暂时不考虑存在多个dropdown的情况-->
    <n-dropdown :trigger="isMobile?'click':'hover'" v-bind="dropdownProps" :options="dropdownProps.options" v-if="dropdownProps.options&&dropdownProps.options.length>0">
      <slot name="more"></slot>
      <n-button size="small" quaternary type="primary" v-if="!$slots.more">
        <template #icon>
          <icon icon="ant-design:more-outlined" class="icon-more"></Icon>
        </template>
      </n-button>
    </n-dropdown>
    <!--默认后置插槽-->
    <n-divider vertical class="action-divider"
        v-if="$slots.suffix && actions.length>0"/>
    <slot name="suffix"></slot>
  </div>
</template>
<script setup lang="ts">
import {useDesign, usePermission} from '@/hooks'
import { TableActionProps, ActionItem} from './types'
import { isBoolean } from 'lodash-es';
import { isFunction, isString} from '@/utils/util';
import { DropdownProps } from './types';
import { useContext } from '@/store/useContext';

defineOptions({name:'TableAction'});

const {prefixCls} = useDesign('base-table-action')
const {isMobile} = storeToRefs(useContext())
const props = withDefaults(defineProps<TableActionProps>(), {
  divider: true,
  stopButtonPropagation: true
});

const slots = defineSlots<{
  ['prefix']: (props?: Recordable)=>any,
  ['suffix']: (props?: Recordable)=>any,
  ['popContent']: (props?: Recordable)=>any,
  ['popAction']: (props?: Recordable)=>any,
  ['popIcon']: (props?: Recordable)=>any,
  ['more']: ()=>any,
}>()

const {popContent, popAction, popIcon} = slots
const popSlots = {popContent, popAction, popIcon}

const { hasPermission } = usePermission()

function isVisible(action: ActionItem):boolean{
  const show = action.show
  let isShow = true;
  if(isBoolean(show)){
    isShow = show
  }else if(isFunction(show)){
    isShow = show(action)
  }
  return isShow
}


const actions = computed(()=>{
  return toRaw(props.actions||[])
  .filter(action=>{
    return hasPermission(action.permission) && isVisible(action)
  })
  .map(action=>{
    // const { popConfirm } = action
    return {
      ...action,
    }
  })
})

const dropdownProps = computed(()=>{
  let bindProps = {} as unknown as DropdownProps
  if(props.dropdownAction){
    const {options=[], ...rest} = props.dropdownAction!!
    const filterOpts = options.filter((opt)=>{
      return hasPermission(opt.permission) && (opt.show||true);  //默认显示opt.show=true
    })
    bindProps = {
      ...rest,
      options:filterOpts
    }
  }
  return bindProps
} );




function getTooltip(data: string | TooltipProps): TooltipProps {
    return {
      placement: 'bottom',
      ...(isString(data) ? { title: data } : data),
    };
  }

function onCellClick(e: MouseEvent) {
  if (!props.stopButtonPropagation) return;
  const path = e.composedPath() as HTMLElement[];
  const isInButton = path.find((ele) => {
    return ele.tagName?.toUpperCase() === 'BUTTON';
  });
  isInButton && e.stopPropagation();
}


</script>
<style lang="scss">
$prefix : '#{$namespace}-base-table-action';
.#{$prefix}{
  display: flex;
  align-items: center;
  .icon-more {
      transform: rotate(90deg);
    svg {
      font-size: 1.1em;
      font-weight: 700;
    }
  }
  .action-divider{
    margin: 0 2px;
  }

  .n-button {
    width:auto;
    padding:0 4px;
    .n-button__icon{margin-right: 0.25rem;}
  }
}
</style>