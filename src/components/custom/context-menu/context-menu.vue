<template>
  <div
      class="fixed z-50 context-menu"
      :style="{ top: e!.y + 'px', left: e!.x + 'px' }"
      v-click-outside="onClickOutside"
  >
    <button
        :disabled="action.disabled"
        v-for="action in actions"
        :key="action.action"
        @click="action.handler()"
    >
      {{ action.label }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import { ContextMenuProp } from './types'
defineOptions({name: 'ContextMenu'})

const props = defineProps<ContextMenuProp>()

function onClickOutside(e:MouseEvent){
  if(props.onClickOutside){
    props.onClickOutside(e)
  }
}

</script>
<style scoped>
.context-menu {
  /* position: absolute; */
  background: white;
  /* border: 1px solid #ccc; */
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  color: #666;
  font-size: 14px;
  border-color: currentColor;
  border-radius: 4px;
}

.context-menu button{
  padding: 10px;
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  width: 100%;
  &:hover{
    background-color: #f7f7f7;
    color: #000;
  }
}


.dark .context-menu {
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10);
  background: rgb(72, 72, 78);
  color:rgba(255, 255, 255, 0.82);
  border-color: currentColor;
}

.dark .context-menu button {
  &:hover{
    background-color: rgba(255, 255, 255, 0.09);
    color:rgba(255, 255, 255, 0.82)
  }
}

</style>