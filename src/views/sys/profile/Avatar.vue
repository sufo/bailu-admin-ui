<template>
  <div class="profile-avatar">
    <!--img外套一层div，解决边框问题-->
    <div class="w-120px h-120px border-rounded-50% bg-[#cccccc] dark:bg-dark" @click="show=true">
      <img :src="option.img as string"
        class="w-100% h-100% border-rounded-50%" />
    </div>
    <n-modal v-model:show="show"
      :mask-closable="false"
      class="profile-avatar-modal min-w-400 max-w-800 w-90% overflow-hidden"
      :title="$t('page.profile.editAvatar')"
      preset="card">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(368px,1fr))]" >
          <div class="w-100% h-350px">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :outputType="option.outputType"
              :autoCrop="option.autoCrop"
              @realTime="realTime" />
          </div>
          <div class="h-350px">
            <div class="avatar-upload-preview"><img :src="previews?.url" :style="previews?.img"/></div>
          </div>
        </div>
      <template #footer>
        <div class="grid grid-cols-12 gap-12">
          <n-upload class="col-span-2" accpt="image/*" :show-file-list="false"	action="#" @before-upload="beforeUpload" :custom-request="customeRequest">
            <n-button :render-icon="r({'icon':'carbon:cloud-upload'})">{{ $t('button.select') }}</n-button>
          </n-upload>
          <n-button :render-icon="r({'icon':'carbon:add'})" @click="cropper.changeScale(1)"></n-button>
          <n-button :render-icon="r({'icon':'carbon:subtract'})" @click="cropper.changeScale(-1)"></n-button>
          <n-button :render-icon="r({'icon':'carbon:rotate-counterclockwise'})" @click="cropper.rotateLeft()"></n-button>
          <n-button :render-icon="r({'icon':'carbon:rotate-clockwise'})" @click="cropper.rotateRight()"></n-button>
          <div class="col-span-6 text-center"><n-button :loading="loading" type="primary" @click="toSubmit()">{{$t('button.submit')}}</n-button></div>
        </div>

      </template>
    </n-modal>
  </div>
</template>
<script setup lang="ts"> 
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import { useUserStore } from '@/store/modules';
import { ShallowReactive } from 'vue';
import type {UploadCustomRequestOptions,UploadFileInfo} from 'naive-ui'
import { useIconRender } from '@/components/icon';
import { userApi } from '@/api/admin';
import { UploadFileParams } from '~/types/axios';

const show = ref(false)
const userStore = useUserStore()
const {r} = useIconRender()
const {t} = useI18n()
const cropper = ref<InstanceType<typeof VueCropper>>()
const previews = ref<CropperPreviewData>()

const option:ShallowReactive<CropperOptions> = shallowReactive({
  img: userStore.userInfo?.avatar||'',
  autoCrop:true,
  autoCropWidth:200,
  autoCropHeight:200,
  outputType:'png',
})
const loading = ref(false)
const realTime = (data:CropperPreviewData)=>{
  console.log("previews",previews.value)
  previews.value=data
}

function beforeUpload({file}:{file:UploadFileInfo}){
  // console.log("file type",file.type)
  if (file.type?.indexOf("image/") == -1) {
    window.$message?.error(t('tips.imgUploadFomartTip'));
    return false;
  } else {
    return true;
  }
}

function customeRequest({file,onFinish}: UploadCustomRequestOptions){
  const reader = new FileReader();
  reader.readAsDataURL(file.file!);
  reader.onload = () => {
    option.img = reader.result;
  };
  onFinish()
}

async function toSubmit(){
  loading.value = true
  try{
    cropper.value.getCropBlob(async (data:Blob)=>{
      const params:UploadFileParams = {file: data}
      const res = await userApi.uploadAvatar(params)
      userStore.setAvatar(res.data.url)
      loading.value=false
      show.value=false
    })
  }finally{
    loading.value = false
  }
}

</script>
<style lang="scss">
.profile-avatar{
  display: flex;
  flex-direction: column;
  >div {
    align-self: center;
    position: relative;
    text-align: center;
    line-height: 120px;
    // max-width: none;
	  // object-fit: cover;	
  }
  >div:hover::after{
    content: '+';
    position: absolute; cursor: pointer;
    left: 0; right: 0; top:0; bottom: 0;
    border-radius: 50%; font-size: 24px;
    -webkit-font-smooth:antialiased;
    -moz-osx-font-smoothing: grayscale;
    color:#efefef; background-color: rgba(0,0,0,.5);
  }
}
.profile-avatar-modal{
  .n-card__content{max-height:370px;overflow-y: auto;}
  //.cropper{height:350px;}
  .avatar-upload-preview {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;
  }
}
</style>