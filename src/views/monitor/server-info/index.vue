<template>
  <div :class="prefixCls" class="grid grid-cols-1 md:grid-cols-2 gap-20px">
    <n-list bordered>
      <template #header>
        <Icon icon="ep:cpu"/>&nbsp;CPU
      </template>
      <n-list-item><span>{{$t('page.server.cores')}}</span><span>{{ data?.cpu.cores}}</span></n-list-item>
      <n-list-item v-for="(c,index) in data?.cpu.cpus">
        <span>cpu-{{index}}</span>
        <n-progress type="line" :percentage="c" :color="preference.theme.themeColor"/>
      </n-list-item>
    </n-list>

    <n-list bordered class="ram">
      <template #header>
        <Icon icon="game-icons:ram" :style="{fontSize:'18px'}"/>&nbsp;{{ $t('page.server.ram') }}
      </template>
      <n-list-item><span>{{ $t('page.server.ram-total') }}</span><span>{{ data?.ram.total}}MB</span></n-list-item>
      <n-list-item><span>{{ $t('page.server.ram-used') }}</span><span>{{ data?.ram.used}}MB</span></n-list-item>
      <n-list-item><span>{{ $t('page.server.ram-free') }}</span><span>{{ data?.ram.free}}MB</span></n-list-item>
      <n-list-item><span>{{ $t('page.server.ram-usage') }}</span><span>{{ data?.ram.usage}}%</span></n-list-item>
      <n-progress type="circle" :percentage="data?.ram.usage" :color="preference.theme.themeColor"/>
    </n-list>

    <n-list bordered class="info md:grid-col-[1/3]">
      <template #header>
        <Icon icon="carbon:cloud-monitoring" :style="{fontSize:'18px'}"/>&nbsp;{{ $t('page.server.info') }}
      </template>
      <div class="px-[20px]">
        <n-list-item>
          <span>{{ $t('page.server.name') }}</span><span>{{ data?.servInfo.name}}</span>
          <span>{{ $t('page.loginLog.os') }}</span><span>{{ data?.servInfo.os}}</span>
        </n-list-item>
        <n-list-item>
          <span>ip</span><span>{{ data?.servInfo.ip}}</span>
          <span>{{ $t('page.server.arch') }}</span><span>{{ data?.servInfo.arch}}</span>
        </n-list-item>
      </div>
    </n-list>

    <n-list bordered class="runtime md:grid-col-[1/3]">
      <template #header>
        <Icon icon="fa6-brands:golang" :style="{fontSize:'18px'}"/>&nbsp;{{ $t('page.server.runtime') }}
      </template>
      <div class="px-[20px]">
        <n-list-item>
          <span>{{ $t('page.server.go-version') }}</span><span>{{ data?.runtime.goVersion}}</span>
          <span>{{ $t('page.server.compiler') }}</span><span>{{ data?.runtime.compiler}}</span>
        </n-list-item>
        <n-list-item>
          <span>{{ $t('page.server.start-time') }}</span><span>{{ data?.runtime.startTime}}</span>
          <span>{{ $t('page.server.run-time') }}</span><span>{{ data?.runtime.runTime}}</span>
        </n-list-item>
        <n-list-item>
          <span>{{ $t('page.server.goroutine-num') }}</span><span>{{ data?.runtime.numGoroutine}}</span>
          <span>&nbsp;</span><span>&nbsp;</span>
        </n-list-item>
      </div>
    </n-list>
    <n-list bordered class="disk md:grid-col-[1/3]">
      <template #header>
        <Icon icon="carbon:vmdk-disk" :style="{fontSize:'18px'}"/>&nbsp;{{ $t('page.server.disk') }}
      </template>
      <div class="px-[20px]">
        <n-list-item>
          <span class="!flex-[2_2_0%]">{{ $t('page.server.disk-path') }}</span><span>{{ $t('page.server.fsType') }}</span>
          <span>{{ $t('page.server.total') }}</span><span>{{ $t('page.server.free') }}</span>
          <span>{{ $t('page.server.used') }}</span><span>{{ $t('page.server.usage') }}</span>
        </n-list-item>
        <n-list-item>
          <span class="!flex-[2_2_0%]">{{ data?.disk.path}}</span><span>{{ data?.disk.fsType}}</span>
          <span>{{ data?.disk.total}}</span><span>{{ data?.disk.free}}</span>
          <span>{{ data?.disk.used}}</span><span>{{ data?.disk.usage}}</span>
        </n-list-item>
      </div>
    </n-list>
  </div>
</template>
<script setup lang="ts">
import { useDesign } from '@/hooks';
import { serverInfoApi } from '@/api/admin'
import { usePreferenceStore } from '@/store/modules';

defineOptions({name: 'ServerInfo'})
const { prefixCls } = useDesign('server-info')
const preference = usePreferenceStore()

const data = ref<ServerInfo>()

async function request<T>(){
  const res = await serverInfoApi.index()
  if(res){
    data.value = res
  } 
};

request();
</script>

<style lang="scss">
$prefix: '#{$namespace}-server-info';
.#{$prefix}{
  .n-list{
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    .n-list__header{font-size:18px; svg{display: inline-block;}}
    .n-list-item{padding-left:0;padding-right:0;margin:0 20px;
      .n-list-item__main{display:flex;gap:10px;align-items:center;span{white-space:nowrap;}}
    }
  }
  .ram{position:relative;
    .n-list-item{width:50%;span:first-child{display:inline-block;width:120px;} }
    .n-progress{position:absolute;right:20px;top:84px;}
  }
  .info,.runtime{
    .n-list-item{display:flex;align-items:center;
      span{flex:1} span:nth-child(2){flex:2}
    }
  }
  .disk{
    .n-list-item{display:flex;align-items:center;span{flex:1;}}
    .n-list-item:first-child{color: #909399;font-weight: 500}
  }

}


</style>