<template>
<n-form :class="prefixCls" ref="formRef" :model="registerForm" :rules="rules" size="large" :show-label="false">
  <n-form-item path="phone">
    <vue-tel-input invalidMsg="isdjosijd" class="n-input" :styleClasses="stateBorder" @on-input="telInputCheck" v-model="registerForm.phone" :input-options="inputOptions"></vue-tel-input>
    <template #feedback><span class="c-[#f5222d]">{{ phoneFeedback }}</span><div class="n-input__state-border"></div></template>
    <!-- <n-input v-model:value="registerForm.phone" maxlength="11" :placeholder="$t('login.mobile')" clearable>
        <template #prefix><icon icon="ep:iphone"/></template></n-input> -->
  </n-form-item>
  <n-form-item path="smsCode">
    <n-input v-model:value="registerForm.smsCode" :input-props="{ type: 'number' }" :show-button="false" :placeholder="$t('login.smsCode')">
        <template #prefix><icon icon="ri:shield-keyhole-line"/></template></n-input>
      <n-button class="ml-8" size="large" :disabled="isCounting" :loading="smsLoading" @click="sendSMS">{{label}}</n-button>
  </n-form-item>
  <n-form-item path="password">
    <n-input  v-model:value="registerForm.password" type="password" show-password-on="click" clearable :placeholder="$t('login.password')">
      <template #prefix><icon icon="ri:lock-fill"/></template></n-input>
  </n-form-item>
  <n-form-item path="repeatPwd">
    <n-input @keydown.enter.prevent 
      v-model:value="registerForm.repeatPwd" 
      :disabled="!registerForm.password"
      type="password" show-password-on="click" clearable :placeholder="$t('login.confirmPassword')">
      <template #prefix><icon icon="ri:lock-fill"/></template></n-input>
  </n-form-item>
  <n-space :vertical="true" :size="18">
    <n-button type="primary" size="large" :block="true" :round="true" :loading="loading" @click="handleSubmit">{{ $t('button.confirm') }}</n-button>
    <n-button class="mt-12" size="large" :block="true" :round="true" @click="$emit('update:active','LOGIN')">{{$t('login.backSignIn') }}</n-button>
    </n-space>
  </n-form>
</template>
<script lang="ts" setup>
import {useDesign} from "@/hooks"
import { useSMSCode,useFormRule } from "@/hooks";
import type {FormInst, FormRules} from 'naive-ui'
import { useI18n } from "vue-i18n";
import {rsa} from '@/utils/rsa'
import {resetPwd} from '@/api/admin'

defineOptions({name:'ResetPwd'})

const {prefixCls} = useDesign("reset-pwd-form")

const emits = defineEmits(['update:active'])

const formRules = useFormRule()
const loading = ref(false)
const formRef = ref<HTMLElement & FormInst>()
const { label, isCounting, loading: smsLoading, getSmsCode } = useSMSCode();
const {t} = useI18n()
const registerForm = reactive({
  dialCode: '',
  phone: '',
  smsCode: '',
  password:'',
  repeatPwd:''
})

const stateBorder = ref('')

const inputOptions = {
  name:'phone',
  type: 'tel',
  mode: 'national',
  placeholder: t('login.mobile')
}

const phoneFeedback = ref('')
const phone = computed(()=>{return registerForm.phone.replace(/\s*/g, "")})
let isFirst = false

//国际手机号校验
//@ts-ignore
const telInputCheck = (number: String, phoneObject:any)=>{
  //第一次不做校验，避免一进入页面就出现错误信息
  if(!isFirst){isFirst=true;return}
  registerForm.dialCode = phoneObject?(phoneObject.country.dialCode||""):""
  const err = formRules.phoneExtValidator(registerForm.phone, toRef(registerForm, 'dialCode'))
  if(err){
    //设置错误信息
    phoneFeedback.value = err.message
    //设置border
    stateBorder.value = 'state-border';
  }
  else {phoneFeedback.value = '';stateBorder.value = '';}
}
//手机号空校验
const telEmptyCheck =()=>{
  if(!registerForm.phone){
    phoneFeedback.value = t('login.mobilePlaceholder')
    //设置border
    stateBorder.value = 'state-border';
  }
}
//手机号是否被占用
const telIsExist = async ()=>{
  //为空或者存在其他错误则不继续校验
  if(!registerForm.phone || phoneFeedback.value) return ;
    
  const res = await formRules.phoneValidator.isExist(toRef(registerForm, 'dialCode'), phone.value)
  if(res){
    phoneFeedback.value = res;
    //设置border
    stateBorder.value = 'state-border';
  }else{phoneFeedback.value = '';stateBorder.value = '';}
}

const rules: FormRules = {
  username: formRules.createRequired(t('login.accountPlaceholder'), ['blur']),
  //因为phone用的第三方组件，所以这里加phone的rule无效，需要单独处理
  smsCode: formRules.smsCode,
  password: formRules.pwd,
  repeatPwd: formRules.confirmPwdRule(toRef(registerForm, 'password'))
};

//发送短信验证码
async function sendSMS() {
  try{
    //检验手机号
    telEmptyCheck()
    telIsExist()
    //检验不通过则返回
    if(!registerForm.phone || phoneFeedback.value) return ;

    await getSmsCode(registerForm.phone, registerForm.dialCode)
  } catch(e: unknown){
    if(e instanceof Error)
      window.$message?.error(e.message)
  }
}

async function handleSubmit(e: MouseEvent){
  e.preventDefault()
  telEmptyCheck() //检查手机号是否为空
  
  try{
    await formRef.value?.validate()

    loading.value = true
    const { password:pwd, smsCode, phone:number, dialCode} = registerForm
    const phone = number.replace(/\s*/g, "")
    const password = rsa.encryptByPublicKey(pwd) as string
    await resetPwd({dialCode,phone,smsCode, password})
    //toLoginModule('LOGIN')
    emits('update:active', 'LOGIN')
  }catch(e){console.log(e)}
  finally{
    loading.value = false
  }
}

</script>
<style lang="scss">
// @prefix: ~'@{namespace}-reset-pwd-form';
// .@{prefix}{
$prefix: '#{$namespace}-reset-pwd-form';
.#{$prefix}{
  .vue-tel-input{
    border: 1px solid rgb(224, 224, 230);
    .vti__input{height: 40px;line-height: 40px;}
    &.state-border{
      border: 1px solid #f5222d;
      box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
    }
  }
  .vti__dropdown-list{z-index: 2;}
}


</style>