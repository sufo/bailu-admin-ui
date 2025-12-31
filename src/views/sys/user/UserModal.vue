<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :class="prefixCls"
    :title="title">
    <base-form v-bind="bindProps">
    </base-form>
  </full-modal>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { enableOrDisableOpt,sexOptions} from '@/constants/options' 
import { userApi } from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'
import { roleApi,postApi } from '@/api/admin';
import {isArrayEqual} from '@/utils/util'
import { rsa } from '@/utils/rsa';

const { t } = useI18n()
const props = defineProps<ModalProps<User>>()

const emit = defineEmits(["update:show", 'success'])
// const show = ref(props.show) //这样没有响应式
// const show = computed(()=>props.show) //这种写法有效
// const {show} = toRefs(props)  //无法修改

const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});

const {prefixCls} = useDesign('user-modal')

//下拉数据
const roles = ref()
const posts = ref()
//获取下拉列表数据
// roleApi.options().then(v=>{roles.value=v})
// postApi.options().then(v=>posts.value=v)

const title = props.isEdit?t('page.user.edit'):t('page.user.add')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const {data, options,isEdit} = props;
  return [
    {field: 'username', component: 'NInput',comProps:{maxlenth:30}, label: t('page.user.name'), defaultValue:data?.['username']},
    {field: 'password', component: 'NInput',hide:isEdit, comProps:{maxlenth:30,type:'password',showPasswordOn:'click'}, label: t('page.user.password'), defaultValue:data?.['password']||'123456'},
    {field: 'phone', component: 'NInput',label: t('page.user.mobile'), defaultValue:data?.['phone']},
    {field: 'email', component: 'NInput',label: t('login.email'), defaultValue:data?.['email']},
    {field: 'roleIds', component: 'NSelect',label: t('page.role.role'), comProps:{options:unref(roles), multiple:true}, defaultValue:data?.['roles']?.map(e=>e.id)},
    {field: 'postIds', component: 'NSelect',label: t('page.post.post'), comProps:{options:unref(posts),multiple:true}, defaultValue:data?.['posts']?.map(e=>e.id)},
    {field: 'deptId', component: 'NTreeSelect',label: t('page.dept.dept'), comProps:{options,cascade:true}, defaultValue:data?.['deptId']},
    {field: 'nickName', component: 'NInput',label: t('page.user.nickName'), defaultValue:data?.['nickName'], comProps:{maxlenth:30}},
    //sex 0保密 1男 2 女
    {field: 'sex', component: 'NSelect',label: t('page.user.sex'), defaultValue:data?.['sex']||1, comProps:{options:sexOptions}},
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}},
    {field: 'remark', component: 'NInput',label: t('common.descInfo'), span:2, defaultValue:data?.['remark'], comProps:{type:"textarea"}},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:120, labelAlign:'right',
  formItems: unref(formItems),
  grid: {cols:"1 m:2"},
  rules:{
    username:[{required: true,message: ''}],
    password:[{required: true,message: ''}],
    nickName:[{required: true,message: ''}],
  },
  submitButtonOptions:{label:t('button.okText'), icon:''},
  resetButtonOptions:{label:t('button.cancelText'), icon:''},
  submitOnReset: false,
  showFeedback:false, 
  action:{
    // offset: 1
  },
  onSubmit: async (formModel:Recordable|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      if(props.isEdit){
        formModel.id = props.data?.id //赋值id
        const {roleIds, postIds} = unref(formModel)
        const formRoles = props.data!.roles!.map(e=>e.id)
        const formPosts = props.data!.posts!.map(e=>e.id)
        if(isArrayEqual(formRoles, toRaw(roleIds))){
          //相等，则不传，不传则不会更新
          formModel.roleIds = undefined
        }
        if(isArrayEqual(formPosts, toRaw(postIds))){
          //相等，则不传，不传则不会更新
          formModel.postIds = undefined
        }
        await userApi.edit(formModel as Recordable)
      }else{
        //密码加密
        formModel.password = rsa.encryptByPublicKey(formModel.password)
        await userApi.create(formModel as Recordable)
      }
      show.value=false
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))

const modalStyle={
  minWidth: '600px',
  // maxHeight: '80vh',
  overflow: 'hidden'
}

watch(
  show,
  (val)=>{
    //每次显示Modal都会去请求最新的角色和岗位下拉数据
    if(val){
      roleApi.options().then(v=>{roles.value=v})
      postApi.options().then(v=>posts.value=v)
    }
  }, { immediate: true }
)

</script>
<style lang="scss">
$prefix: '#{$namespace}-user-modal';
.#{$prefix}{
  .bailu-base-form{
    padding-left:0;
    padding-right:20;
    .n-form-item-blank{
      flex-direction: column;
      align-items: flex-start;
      .acts{height:34px;display:flex;align-items:center;gap:20px;}
      .n-tree--checkable{
        margin-top:6px;
        border:1px solid rgb(224, 224, 230);
        width:100%;
      }
    }
  }
}


</style>