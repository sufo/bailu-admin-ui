<template>
  <n-popover class="!p-0" trigger="click" placement="bottom">
    <template #trigger>
      <tool-tip :tooltip-content="$t('layout.header.tooltipNotify')" :inverted="appStore.header.inverted" class="relative w-40px h-full">
        <icon icon="clarity:notification-line" size="18" />
        <n-badge
          :value="count"
          :max="99"
          :class="[count < 10 ? '-right-2px' : '-right-10px']"
          class="absolute top-10px"
        />
      </tool-tip>
    </template>
    <n-tabs
      v-model:value="currentTab"
      :class="[isMobile ? 'w-276px' : 'w-360px']"
      type="line"
      justify-content="space-evenly">
      <n-tab-pane v-for="(item, index) in tabData" :key="item.key" :name="index">
        <template #tab>
          <div class="flex-x-center items-center" :class="[isMobile ? 'w-92px' : 'w-120px']">
            <span class="mr-5px">{{ item.name }}</span>
            <n-badge
              v-bind="item.badgeProps"
              :value="item.list.filter(message => !message.isRead).length"
              :max="99"
              show-zero/>
          </div>
        </template>
        <loading-empty-wrapper
          class="h-360px"
          :loading="loading"
          :empty="item.list.length === 0"
          placeholder-class="bg-$n-color transition-background-color duration-300 ease-in-out">
          <message-list :list="item.list" @read="handleRead" />
        </loading-empty-wrapper>
      </n-tab-pane>
    </n-tabs>
    <div v-if="showAction" class="flex border-t border-$n-divider-color cursor-pointer">
      <div class="flex-1 text-center py-10px" @click="handleClear">{{ $t('button.clear') }}</div>
      <div class="flex-1 text-center py-10px border-l border-$n-divider-color" @click="handleAllRead">{{ $t('button.allToReaded') }}</div>
      <div class="flex-1 text-center py-10px border-l border-$n-divider-color" @click="handleLoadMore">{{$t('loading.viewMore')}}</div>
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
import { usePreferenceStore } from '@/store/modules';
import { useBoolean } from '@/hooks';
import messageList from './MessageList.vue'
import { msgApi } from '@/api/admin';
import { useI18n } from 'vue-i18n'
import {useContext} from '@/store/useContext'

defineOptions({ name: 'Message' });

const appStore = usePreferenceStore();
const {isMobile} = storeToRefs(useContext())
const { bool: loading } = useBoolean();


const currentTab = ref(0);

const {t} = useI18n()
const msgTypeMap={notice:t('page.msg.notice'),event:t('page.msg.message'),chat:t('page.msg.to-do'),}


const tabData = ref<App.MessageTab[]>([
  {
    key: 1,
    name: t('page.msg.notice'),
    badgeProps: { type: 'warning' },
    list: []
  },
  {
    key: 2,
    name: t('page.msg.message'),
    badgeProps: { type: 'error' },
    list: []
  },
  {
    key: 3,
    name: t('page.msg.to-do'),
    badgeProps: { type: 'info' },
    list: []
  }
]);


const count = computed(() => {
  return tabData.value.reduce((acc, cur) => {
    // console.log("cur.list",cur.list)
    return acc + cur.list.filter(item => !item.isRead).length;
  }, 0);
});

const showAction = computed(() => tabData.value[currentTab.value].list.length > 0);
const msgType = computed(()=>{return ['notice','event','chat'][currentTab.value] as MessageType})

async function handleRead(index: number) {
  const res = await msgApi.read(msgType.value, tabData.value[currentTab.value].list[index].id+"")
  if(res){
    tabData.value[currentTab.value].list[index].isRead = true;
  }
}

async function handleAllRead() {
  // tabData.value[currentTab.value].list.forEach(item => Object.assign(item, { isRead: true }));
  const res = await msgApi.readAll(msgType.value)
  if(res){
    loadData(msgType.value)
  }  
}

function handleClear() {
  const d = window.$dialog!.warning({
        title:t('tips.systemPrompt'),
        content: t('tips.clear-warn',{v:msgTypeMap[msgType.value]}),
        positiveText: t('button.confirm'),
        negativeText: t('button.cancelText'),
        onPositiveClick: async () => {
          d.loading = true
          const res = await msgApi.clear(msgType.value)
          d.loading =false
          if(res){
            window.$message?.success(res.message)
          }
        },
      })
}

function handleLoadMore() {
  loadData(msgType.value)
}

function loadData(msgType: MessageType){
  msgApi.unreadList({type:msgType}).then((res)=>{
    const index = ['notice','event','chat'].indexOf(msgType)
    // console.log("res",res)
    tabData.value[index].list = res
  })
}

loadData('notice')
loadData('event')
loadData('chat')


</script>
<style scoped></style>
