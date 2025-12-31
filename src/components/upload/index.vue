<template>
  <n-input
    clearable 
    @paste.native="onPasteUpload($event)" 
    placeholder="可在此处粘贴（ctrl+v / command+v）文件内容，或选择上传文件">
  </n-input>
  <n-upload
    @before-upload="onBeforeUnload"
    @preview="onPreview"
    v-bind="bindProps">
    <template #default>
      <slot>
        <el-button type="primary" plain>选择上传文件</el-button>
      </slot>
    </template>
  </n-upload>
</template>
<script lang="ts" setup>
import type { UploadProps as NaiveUploadProps,UploadFileInfo } from 'naive-ui';
defineOptions({name:"Upload"})

interface UploadProps extends NaiveUploadProps{
  size?: number,
  prefixPath: string,
}

const bindProps = withDefaults(defineProps<UploadProps>(),{
  
})


interface Emits{
  (e: 'upload', d:UploadFileInfo):void
}
const emit = defineEmits<Emits>()
// 粘贴回调
const onPasteUpload = (event:ClipboardEvent) => {
    let items = event.clipboardData && event.clipboardData.items;
    let file = null
    if (items && items.length) {
        // 检索剪切板items
        if (items[0].kind == 'file') {
            file = items[0].getAsFile()
        } else {
            window.$message?.warning('粘贴内容不是文件内容，请重新复制后粘贴')
        }
    }
    if (!file) {
        return;
    }
    // const uid = UUID.generate()
    // file.uid = uid
    // fileList.value.push({ 
    //   name: file.name,
    //   size: file.size,
    //   filename: 'file', 
    //   raw: file,
    //   status: 'ready',
    //   uid:uid,
    // })
    // uploadImg({ filename: 'file', file: file })
}

function onBeforeUnload({file}:{ file: UploadFileInfo, fileList: Array<UploadFileInfo> }){
  function next() {
      // 上传事件
      emit("upload", file);

      // 赋值
      // if (item) {
      //   Object.assign(item, d);
      // } else {
      //   if (props.multiple) {
      //     if (!isAdd.value) {
      //       ElMessage.warning(`最多只能上传${limit}个文件`);
      //       return false;
      //     } else {
      //       list.value.push(d);
      //     }
      //   } else {
      //     list.value = [d];
      //   }
      // }

      return true;
  }


  // if (file.size / 1024 / 1024 >= limitSize) {
  //   ElMessage.error(`上传文件大小不能超过 ${limitSize}MB!`);
  //   return false;
  // }
  return next();
}


</script>