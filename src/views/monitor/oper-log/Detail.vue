<template>
<div :class="prefixCls" 
  class="bg-gray-800 px-20px py-24px rounded-8px text-gray-100 subpixel-antialiased">
  <div class="mb-8px flex"><div class="h-12px w-12px bg-red-500 rounded-full"></div>
      <div class="ml-8px h-12px w-12px bg-orange-300 rounded-full"></div>
      <div class="ml-8px h-12px w-12px bg-green-500 rounded-full"></div>
  </div>
  <ul>
    <li><span>{{$t('page.oper.reqTime')}}:</span> <p>{{ createdTime }}</p></li>
    <li><span>{{$t('page.oper.operUser')}}:</span> <p>{{ operName }}</p></li>
    <li><span>{{$t('page.oper.reqPath')}}:</span> <p>{{ path }}</p></li>
    <li><span>{{$t('common.status')}}:</span> <p>{{ respCode===0?$t('status.success'):$t('status.failure') }}</p></li>
    <li><span>IP: </span> <p>{{ ip }}</p></li>
    <li><span>{{$t('page.oper.addr')}}: </span> <p>{{ location }}</p></li>
    <li><span>{{$t('page.oper.reqMathod')}}:</span> <p>{{ method }}</p></li>
    <li><span>{{$t('page.oper.client')}}:</span> <p>{{ os }}</p></li>
    <li><span>{{$t('page.oper.browser')}}:</span> <p>{{ browser }}</p></li>
    <li><span>{{$t('page.oper.latency')}}:</span> <p>{{ latency }}</p></li>
    <li><span>{{$t('page.oper.reqParams')}}:</span> <pre>{{ body }}</pre></li>
    <li><span>{{$t('page.oper.respBody')}}:</span> <pre>{{ resp }}</pre></li>
  </ul>

</div> 
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import { usePreferenceStore } from '@/store/modules';
import dayjs from 'dayjs';

const {prefixCls} = useDesign('oper-detail')
const preference = usePreferenceStore()

defineOptions({ name: 'OperDetail' });

const props = defineProps<Operation>()

const createdTime = computed(()=>dayjs.utc(props.createdAt).local().format(preference.timeTemplate))
</script>

<style lang="scss">
$prefixCls: '#{$namespace}-oper-detail';
.#{$prefixCls}{
  overflow: hidden;
  display: flex; flex-direction: column;
  height: 100%; overflow:hidden;

  ul{flex:1;height:0; overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  ul li{
    display: flex; align-items:flex-start;line-height:2;
    >span{color:rgb(52, 211, 153);min-width:80px;white-space:nowrap;}
    p,pre{padding-left: 0.5rem;word-wrap: break-word;white-space: pre-wrap; overflow:hidden}
  }
}
</style>