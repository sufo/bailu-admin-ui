<template>
  <div class="flex-col-center wh-full text-400px text-primary">
      <!-- <icon-not-found v-if="type === '404'" /> 需要unplugin-icons插件，将svg直接作为组件使用 -->
      <svg-icon size="100%"  name="no-permission" v-if="type === '403'"/>
      <svg-icon size="100%" name="not-found" v-if="type === '404'"/>
      <svg-icon size="100%"  name="service-error" v-if="type === '500'"/>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineOptions({ name: 'Exception' });

//能处理的错误状态码
type StatusCode = '403' | '404' | '500'

const route = useRoute()

const status = route.params.status||'404'

const type = ['403' ,'404' , '500'].includes(status as StatusCode) ? status : '404'

</script>

<style scoped></style>
