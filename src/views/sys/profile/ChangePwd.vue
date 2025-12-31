<template>
  <n-form class="px-20px pt-15px pb-20px" ref="pwdFormRef" 
    :model="formModel" :rules="rules" :labelWidth="labelWidth" label-placement="left">
    <n-form-item path="password" :label="$t('page.profile.currentPwd')">
    <n-input  v-model:value="formModel.password" type="password" show-password-on="click" clearable :placeholder="$t('page.profile.currentPwdTip')"/>
    </n-form-item>
    <n-form-item path="newPassword" :label="$t('page.profile.newPwd')">
    <n-input  v-model:value="formModel.newPassword" type="password" show-password-on="click" clearable :placeholder="$t('page.profile.newPwdTip')"/>
    </n-form-item>
    <n-form-item path="repeatPwd" :label="$t('login.confirmPassword')" first>
      <n-input @keydown.enter.prevent 
        v-model:value="formModel.repeatPwd" 
        :disabled="!formModel.newPassword"
        type="password" show-password-on="click" clearable :placeholder="$t('page.profile.repeatPwdTip')">
        <template #prefix><icon icon="ri:lock-fill"/></template></n-input>
    </n-form-item>
    <n-form-item label="   " size="small">
      <n-button type="primary" :loading="loading" @click="handleSubmit">{{ $t('button.saveText') }}</n-button>
      <n-button class="ml-12" @click="$emit('tabClose')">{{$t('button.closeText') }}</n-button>
    </n-form-item>
  </n-form>
</template>
<script setup lang="ts">
import type {FormRules} from 'naive-ui'
import {useFormRule} from '@/hooks'
import { rsa } from '@/utils/rsa';
import { userApi } from '@/api/admin';
import { useUserStore } from '@/store/modules';
import { useLocale } from '@/locales/useLocale';


defineOptions({name: 'ChangePassword'})

const formRules = useFormRule()
const formModel = reactive({
  password: '',
  newPassword: '',
  repeatPwd:''
});
const userId = useUserStore().getUserInfo.id
const loading = ref(false);
const pwdFormRef = ref();
const rules:FormRules = {
  password:formRules.pwd,
  newPassword: formRules.pwd,
  repeatPwd: formRules.confirmPwdRule(toRef(formModel, 'newPassword'))
}

async function handleSubmit(){
  try{
    await pwdFormRef.value?.validate()
    loading.value = true
    const { password:pwd, newPassword:newPwd} = formModel
    const password = rsa.encryptByPublicKey(pwd!) as string
    const newPassword = rsa.encryptByPublicKey(newPwd!) as string
    await userApi.changePwd(userId, password ,newPassword)
  }catch(e){console.log(e)}
  finally{
    loading.value = false
  }
}


const {getLocale} = useLocale()
const labelWidth = computed(()=>{
  return getLocale.value == 'zh-CN' ? 80: 140
})
</script>