<template>
  <n-form :class="prefixCls" ref="formRef" v-model="loginForm" :rules="rules" size="large" :show-label="false">
    <n-form-item path="phone">
      <n-input v-model:value="loginForm.phone" maxlength="11" :placeholder="$t('login.mobile')" clearable>
        <template #prefix><icon icon="ep:iphone"/></template></n-input>
    </n-form-item>
    <n-form-item path="smsCode">
      <n-input-number v-model="loginForm.smsCode" :show-button="false" :placeholder="$t('login.smsCode')">
        <template #prefix><icon icon="ri:shield-keyhole-line"/></template></n-input-number>
      <n-button class="ml-8 w-111" size="large" :disabled="isCounting" :loading="smsLoading" @click="sendSMS">{{label}}</n-button>
    </n-form-item>
  
    <n-button type="primary" size="large" :block="true" :round="true" :loading="loading" @click="handleSubmit">{{ $t('login.loginButton') }}</n-button>
    <n-button class="mt-12" size="large" :block="true" :round="true" @click="$emit('update:active','LOGIN')">{{$t('login.backSignIn') }}</n-button>
  </n-form>
</template>

<script lang="ts" setup>
import {useFormRule,useSMSCode, useDesign} from '@/hooks'
import type {FormInst,FormRules} from 'naive-ui'
import { useUserStore } from '@/store/modules/user';


defineOptions({name: 'MobileForm'})

const {smsLogin} = useUserStore()
const loading = ref(false)
const formRules = useFormRule()
const loginForm = reactive({
  phone: '',
  smsCode: '',
  // captchaId: '',
  // imgCode: ''
})
const rules:FormRules = {
  phone: formRules.phone,
  smsCode: formRules.smsCode,
}

const {prefixCls} = useDesign('login-mobile')
const formRef = ref<HTMLElement & FormInst>();

const { label, isCounting, loading: smsLoading, getSmsCode } = useSMSCode();

async function sendSMS() {
    const smsToken = getSmsCode(loginForm.phone).catch(e=>{
      if (e instanceof Error) 
      window.$message?.error(e.message);
    })
    console.log(smsToken)
}

async function handleSubmit(){
  await formRef.value?.validate()

  const {phone,smsCode } = loginForm

  loading.value = true
  await smsLogin(phone, smsCode)
  loading.value = false
}


</script>