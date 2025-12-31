<template>
  <footer v-bind="$attrs"
    :class="classNames"
    v-show="!hide&&visible">
    <span>Copyright ©2023 bailu</span>
  </footer>
  <!--占位-->
  <div v-if="visible"
    v-show="showPlacement"
    :class="`${prefixCls}-placement`"
  ></div>

</template>
<script setup lang="ts">
import { computed } from 'vue';
import {useAppStore, usePreferenceStore} from '@/store/modules'
import {useDarkStyle,useDesign} from '@/hooks'
import { useBasicLayout } from '../layout';

defineOptions({name:'LayoutFooter'})
const {prefixCls} = useDesign('layout-footer');
const { useLayoutCls } = useBasicLayout()
const {useDarkWrapCls} = useDarkStyle()
const theme = usePreferenceStore()
const app = useAppStore()
const visible = computed(()=>theme.footer.visible)
const hide = computed(()=>app.fullContent)
const showPlacement = computed(()=>!app.fullContent && theme.footer.fixed )

const classNames = computed(()=>{
  const fixed = theme.footerSetting.fixed
  const inverted = theme.footerSetting.inverted
  return [
    ...useLayoutCls(prefixCls, fixed, inverted),
    useDarkWrapCls(inverted),
    // 'dark:bg-#101014!'
  ]
})


</script>
<style lang="scss">
// @prefixCls: ~'@{namespace}-layout-footer';
// .@{prefixCls} {
$prefixCls: '#{$namespace}-layout-footer';
.#{$prefixCls} {
    height: $footer-height;
    z-index: var(--footer-z-index);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  &--fixed{
    // position: absolute;
    // top: $header-height;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }  
  &-placement{
    height: $footer-height;
    overflow: hidden;
  }
}
</style>