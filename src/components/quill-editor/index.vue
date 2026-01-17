<template>
  <div :class="prefixCls">
    <vue-quill-editor v-model:content="content" :options="options" content-type="html" />
  </div>
</template>
<script setup lang="ts">
import {QuillEditor as VueQuillEditor,Quill} from '@vueup/vue-quill'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'
import ImagePaste from './image-paste'
import ImageUploader from "quill-image-uploader";
import {uploadApi} from '@/api/admin'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useDesign } from '@/hooks';

defineOptions({name:'quill-editor'})
const {prefixCls} = useDesign("editor-box")
const prop = defineProps({
  modelValue: {
    type:String,
    default:''
  }
})
const emit = defineEmits(['update:modelValue'])
const content = ref(prop.modelValue);//定义content

if (!Quill.imports["modules/BlotFormatter"]) {
  Quill.register("modules/BlotFormatter", BlotFormatter);
}
if (!Quill.imports["modules/ImagePaste"]) {
  Quill.register("modules/ImagePaste", ImagePaste);
}

if(!Quill.imports["modules/imageUploader"]){
  Quill.register("modules/imageUploader", ImageUploader);
}

 // 定义一个响应式的 editorOptions 对象，其中包含了需要配置的选项参数
const options = reactive({
  modules: {
    imageUploader:{
      upload:async (file:File)=>{
        const res = await uploadApi({file})
        console.log(res)
        return res.data.url
      }
    },
    toolbar:[  // 工具栏配置
      ['bold', 'italic', 'underline', 'strike'],  // 粗体、斜体、下划线、删除线
      ["blockquote", "code-block"], 
      // [{ 'header': 1 }, { 'header': 2 }],  // 标题1和标题2
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // 有序列表和无序列表
      [{ 'script': 'sub' }, { 'script': 'super' }],  // 上标和下标
      [{ 'indent': '-1' }, { 'indent': '+1' }],  // 缩进
      [{ 'direction': 'rtl' }],  // 文字方向
      [{ 'size': ['small', false, 'large', 'huge'] }],  // 字号
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  // 标题等级
      [{ 'color': [] }, { 'background': [] }],  // 字体颜色和背景色
      // [{ 'font': [] }],  // 字体
      [{ 'align': [] }],  // 对齐方式
      ['clean'],  // 清除格式
      ["link", "image", "video"],
      // ["template-partediario"]
    ],
  },
  theme: 'snow',
})

// const modules = {
//   name: 'blotFormatter',  
//   module: BlotFormatter, 
//   options: {/* options */}
// }

watchEffect(
  ()=>{
    // console.log("content", toRaw(unref(content)))
    emit("update:modelValue",toRaw(unref(content)))}
)

</script>

<style lang="scss">
$prefix: '#{$namespace}-editor-box';
.#{$prefix}{
  .ql-container{
    height:300px;
  }
}
</style>