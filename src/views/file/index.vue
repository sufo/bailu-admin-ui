<template>
 <collapse-container class="rd-xl" :class="prefixCls" :right-title="rightTitle" left-width="260px">
  <template #left>
    <div class="left-classify px-[10px] whitespace-nowrap flex flex-items-center h-40px gap-[10px]">
      <span class="flex-1-hidden">分类</span>
      <icon size="18" icon="bi:arrow-repeat" :title="$t('common.refresh')" />
      <icon v-if="!hasCategory" size="18" icon="bi:plus-lg" :title="$t('button.add')" v-permission="{value:'file:group:create'}"/>
    </div>
    <dynamic-tags v-model:value="categories" class="p-[10px]"
      :can-create="categoryApi.canCreate"
      :context-menu="categoryApi.menuProps"
      @save="categoryApi.save" 
      @remove="categoryApi.remove"
      @change="categoryApi.change" />
  </template>
  <template #default>
     <div class="h-[50px] flex items-center gap-[10px]">
      <n-button @click="refeshFiles">{{$t('common.refresh')}}</n-button>
      <n-upload class="w-auto" action="#" :custom-request="cusRequest" multiple 
        :show-file-list="false" ref="fileUpdRef"
        @finish="onFinish">
        <n-button type="primary">{{ $t('page.file.click-upload') }}</n-button>
      </n-upload>
      <n-button type="error">{{ $t('button.del') }}</n-button>
     </div>
     <ul class="flex-1 h-full overflow-y-auto flex-wrap gap-[10px]" @dragover="onDragover" @drop="onDrop">
      <li class=""></li>
     </ul>
     <div class=""></div>
     <n-pagination v-bind="getPagination" class="py-[10px] justify-center"/>
  </template>
 
 </collapse-container>
</template>

<script setup lang="ts">
import { useDesign } from '@/hooks';
import {useFileManager} from './use-file'
defineOptions({name: "FileManager"})

const {prefixCls} = useDesign("file-info")

const rightTitle=ref("文件列表")

const {categories,categoryApi, getPagination,refeshFiles,cusRequest,fileUpdRef,
  onFinish
} = useFileManager()

const hasCategory = computed(()=>{
  return categories.value && categories.value.length > 0
})

function onDragover(e:DragEvent){
  e.preventDefault()
}

function onDrop(e:DragEvent){
  e.preventDefault();
  if(e.dataTransfer){
    e.dataTransfer.files.forEach((f,index)=>{
      setTimeout(()=>{
        fileUpdRef.value.upload(f);
      },index * 10)
    })
  }
}

</script>