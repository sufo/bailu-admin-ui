<template>
  <n-form :class="prefixCls" ref="formRef" :model="loginForm" :rules="rules" size="large" :show-label="false">
    <n-form-item path="username">
      <n-input v-model:value="loginForm.username" :placeholder="$t('login.username')" clearable>
        <template #prefix><icon icon="ri:user-3-fill"/></template></n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input v-model:value="loginForm.password" type="password" show-password-on="click" clearable :placeholder="$t('login.password')">
        <template #prefix><icon icon="ri:lock-fill"/></template></n-input>
    </n-form-item>

    <!--vue自动生成验证码，这好像违背了验证码的作用-->
    <!-- <n-form-item path="code">
      <n-input v-model="loginForm.code" clearable />
      <captcha v-model:code="loginForm.code"/>
    </n-form-item> -->

    <!--服务端生成验证码-->
    <n-form-item path="imgCode">
      <n-input class="flex-1 rounded-r-none" v-model:value="loginForm.imgCode" clearable :placeholder="$t('login.captchaPlaceHolder')">
        <template #prefix><icon icon="ri:shield-keyhole-line"/></template></n-input>
      <img :src="captcha" @click="getCode" class="h-full w-120">
    </n-form-item>
  
    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="rememeberMe">{{$t('login.rememberMe') }}</n-checkbox>
        <span class="text-primary cursor-pointer" @click="$emit('update:active','RESET_PASSWORD')">{{$t('login.forgetPassword') }}</span>
      </div>
      <n-button type="primary" size="large" :block="true" :round="true" 
      :loading="loading" @click="handleSubmit">{{ $t('login.loginButton') }}</n-button>
    </n-space>
    <n-space justify="space-between" class="mt-16">
      <n-button @click="$emit('update:active','MOBILE')">{{$t('login.mobileSignIn')}}</n-button>
      <n-button>{{$t('login.qrCodeSignIn')}}</n-button>
      <n-button @click="$emit('update:active','REGISTER')">{{$t('login.signUp')}}</n-button>
    </n-space>
    <n-divider dashed class="text-12 color-#303133 dark:color-#ffffff">{{$t('login.socialLoginIn') }}</n-divider>
    <n-space class="social" justify="space-evenly">
      <icon icon="mdi:wechat" size="20"/><icon icon="ion:logo-alipay"/>
      <icon icon="mdi:google"/><icon icon="mdi:twitter"/>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import {useFormRule} from '@/hooks/'
import { useI18n } from 'vue-i18n';
import type {FormInst,FormRules} from 'naive-ui'
import { useUserStore } from '@/store/modules/user';
import { getCaptcha } from '@/api/admin';
import { useDesign } from '@/hooks';
import { onKeyStroke } from '@vueuse/core';
import webStorage from '@/utils/storage';

const {t} = useI18n()
const {doLogin} = useUserStore()

const formRules = useFormRule()
const loginForm = reactive({
  // username: 'bailu',
  // password: '123456',
  username: 'bailu',
  password: '123456',
  captchaId: '',
  imgCode: ''
})
const rules:FormRules = {
  username: formRules.createRequired(t('login.accountPlaceholder')),
  password: formRules.createRequired(t('login.passwordPlaceholder')),
  imgCode: formRules.captchaNumber
}

// const {toLoginModule} = useRouterPush()
const {prefixCls} = useDesign('login-form')
const formRef = ref<HTMLElement & FormInst>();
const rememeberMe = ref(false)
const loading = ref(false);
let captcha = ref('')

async function handleSubmit(){
  await formRef.value?.validate()

  loading.value = true
  const params = Object.assign({}, loginForm)

  await doLogin(params).then(()=>{
    //处理记住用户
    if(rememeberMe.value)
     setCookie()
  }).catch(e=>{
      //登录失败刷新图形验证码
      getCode()
  })
  loading.value = false
}

onKeyStroke('Enter', handleSubmit)

async function getCode() {
  await getCaptcha().then(({picPath, captchaId})=>{
    captcha.value = picPath
    loginForm.captchaId=captchaId
  }).catch((e)=>{
    captcha.value = '#'
  })
}

function getCookie(){
  let u = webStorage.getCookie('username')
  let p  = webStorage.getCookie('pwd','',true)
  rememeberMe.value = (!!u && !!p)
  if(rememeberMe.value){
    loginForm.username = u
    loginForm.password = p
  }
}

function setCookie(){
  webStorage.setCookie("username", loginForm.username)
  webStorage.setCookie("pwd", loginForm.password,true)
}

onMounted(()=>{getCode()})

getCookie()

</script>
<style lang="scss">
$prefix: '#{$namespace}-login-form';
.#{$prefix}{
  .social{
    span:hover{color:var(--primary-color);}
  }
}
</style>