<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot></slot>
          <registeNaiveTools />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>
<script lang="ts" setup>
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'
import { defineComponent } from 'vue'

defineOptions({ name: 'NaiveProvider' });

//下面naive组件的使用必须包裹在下xxx-provider组件下才能调用
//https://github.com/tusen-ai/naive-ui/issues/225
//所以这里定义一个内部组件放到xxx-provider下面
const registeNaiveTools = defineComponent({
  name:"RegisteNaiveTools",
  setup() {
    //挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
    window.$loadingBar = useLoadingBar()
    window.$dialog = useDialog()
    window.$message = useMessage()
    window.$notification = useNotification()
    // console.log('挂载反馈组件')
  },
  render() {
    return h('div')
  },
})
</script>
