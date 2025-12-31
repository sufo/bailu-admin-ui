<template>
  <n-form class="px-20px pt-15px" ref="userFormRef" :labelWidth="110"
    :model="formModel" :rules="rules" label-placement="left">
    <n-form-item path="nickName" :label="$t('page.user.nickName')">
      <n-input  v-model:value="formModel.nickName" clearable />
    </n-form-item>
    <n-form-item path="phone" :label="$t('page.user.mobile')">
      <n-input  v-model:value="formModel.phone" clearable />
    </n-form-item>
    <n-form-item path="email" :label="$t('login.email')">
      <n-input  v-model:value="formModel.email" clearable />
    </n-form-item>
    <n-form-item path="sexOptions" :label="$t('page.user.sex')">
      <n-radio-group v-model:value="formModel.sex" name="radiogroup">
        <n-space>
          <n-radio v-for="s in sexI18nOptions" :key="s.value" :value="s.value">{{ s.label }}</n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item path="profile" :label="$t('page.profile.name')">
      <n-input type="textarea" v-model:value="formModel.profile" :maxlength="200" clearable showCount/>
    </n-form-item>
    <n-form-item label="   " size="small">
      <n-button type="primary" :loading="loading" @click="handleSubmit">{{ $t('button.saveText') }}</n-button>
      <n-button class="ml-12px"  @click="$emit('tabClose')">{{$t('button.closeText') }}</n-button>
    </n-form-item>
  </n-form>
</template>
<script setup lang="ts">
import { userApi } from '@/api/admin'
import { useFormRule } from '@/hooks';
import type { FormRules } from 'naive-ui'
import {sexOptions} from '@/constants/options'
import {useUserStore} from '@/store/modules'

defineOptions({name: 'General'})

const {t} = useI18n()
const userStore = useUserStore()
const {
  id,username,nickName,phone,sex, email,profile
} = userStore.getUserInfo
const formRules = useFormRule()
const sexI18nOptions = sexOptions(t)
const formModel = reactive({
  id,
  username,
  nickName,
  phone,
  email,
  sex: sex || sexI18nOptions[0].value,
  profile
});
const loading = ref(false);
const userFormRef = ref();
const rules:FormRules = {
  nickName:formRules.createRequired(''),
  phone: formRules.createRequired(''),
  email: formRules.createRequired(''),
}

async function handleSubmit(){
  try{
    await userFormRef.value?.validate()
    loading.value=true
    const user = await userApi.editProfile(formModel)
    //保存
    userStore.setUserInfo(user)
  }catch(e){console.log(e)}
  finally{
    loading.value = false
  }
}

</script>