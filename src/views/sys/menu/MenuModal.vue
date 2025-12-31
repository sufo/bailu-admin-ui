<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 12:15:07
 * @Desc: 
-->
<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :block-scroll="false"
    :title="title">
    <base-form v-bind="bindProps" ref="menuFormRef">
      <template #bindApi="{model,field}">
        <n-tree-select multiple checkable
          check-strategy="child"
          v-model:value="model[field]"
          :options="options" clearable filterable
          :render-label="renderLabel">
        </n-tree-select>
      </template>
    </base-form>
  </full-modal>

</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { menuType,whetherOptions, enableOrDisableOpt} from '@/constants/options' 
import {menuApi} from '@/api/admin'
import { IconPicker } from '@/components/icon';
import {isBoolean} from 'lodash-es'
import { TreeSelectOption } from 'naive-ui/lib';
import BaseForm from '@/components/form/BaseForm.vue';
import { useContext } from '@/store/useContext';

const { t } = useI18n()
const props = defineProps<ModalProps<MenuVo,TreeSelectOption[]>>()
const {isMobile} = storeToRefs(useContext())
const emit = defineEmits(["update:show", 'success'])
// const show = ref(props.show) //这样没有响应式
// const show = computed(()=>props.show) //这种写法有效
// const {show} = toRefs(props)  //无法修改

//v-model:show="show"
const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    // if(props['onUpdate:show']){
    //   props['onUpdate:show'](val)
    // }
    // else 
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});
watch(show,(val:boolean)=>{
  if(val){
      //重新请求menus
    fetchMenus()
  }
  emit('update:show', val)
})

const menuFormRef = ref<null|InstanceType<typeof BaseForm>>(null)

const title = props.isEdit?t('page.menu.edit'):t('page.menu.add')
const menus:Ref<MenuVo[]> = ref([])
const formItems:ComputedRef<FormItemProps[]> = computed(()=>{
  const data = props.data;
  return [
    {field: 'type', component: 'NRadioButton',label: t('page.menu.type'), defaultValue:data?.['type']||'M', comProps:{options:menuType(t),},span:24},
    {field: 'name', component: 'NInput',label: t('page.menu.name'), defaultValue:data?.['name']},
    {field: 'icon', component: IconPicker,label: t('page.menu.icon'), defaultValue:data?.['icon'], hide: opt=>opt.type==='F'},
    {field: 'pid', component: 'NTreeSelect',label: t('page.menu.parent'), defaultValue:data?.['pid'], comProps:{options:unref(menus), labelField:'name', keyField:'id',to:"body"}},
    {field: 'sort', component: 'NInputNumber',label: t('common.showSort'), defaultValue:data?.['sort']||1},
    {field: 'path', component: 'NInput',label: t('page.menu.routerPath'), defaultValue:data?.['path'], hide: opt=>opt.type==='F', labelTip:t('tips.route-path')},
    {field: 'component', component: 'NInput',label: t('page.menu.comPath'), defaultValue:data?.['component'], hide: opt=>opt.type!=='C', labelTip: t('tips.component-path')},
    {field: 'permission', component: 'NInput',label: t('page.menu.authTag'), defaultValue:data?.['permission'], hide: opt=>opt.type==='M', labelTip:`${t("tips.auth-id")}@PreAuthorize(\`@ss.hasPermi('sys:user:list')\`)`},
    {field: 'i18nKey', component: 'NInput',label: t('page.menu.i18nKey'), defaultValue:data?.['i18nKey']},
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}, labelTip: t("tips.menu-status")},
    {field: 'isFrame', component: 'NRadioButton',label: t('page.menu.isExternal'), defaultValue:data?.['isFrame']??false,hide: opt=>opt.type==='F', comProps:{options:whetherOptions}, labelTip:t('tips.external-link')},
    {field: 'keepAlive', component: 'NRadioButton',label: t('page.menu.isCache'), defaultValue:data?.['keepAlive']??true,hide: opt=>opt.type!=='C', comProps:{options:whetherOptions}, labelTip:t('tips.keep-alive')},
    {field: 'hide', component: 'NRadioButton',label: t('common.visibleStatus'), defaultValue:data?.['hide']??false,hide: opt=>opt.type==='F', comProps:{options:[{value: false, label: t('status.show')},{value: true, label: t('status.hide')}]}},
    // {field: 'bindApi', component: 'NTreeSelect', label: t('page.menu.bind-api'), defaultValue:data?.apis?.map(a=>`${a.method}_${a.path}`), hide:opt=>opt.type!=='F', comProps:{options:unref(apiList)}}
    {field: 'bindApi', slot:"bindApi",span:2, defaultValue:data?.apis?.map(a=>`${a.method}_${a.path}`), label: t('page.menu.bind-api'), hide:opt=>opt.type!=='F'}
  ]
});


function bindApiNotChange(newApi: string[], oldApi: MenuApi[]) {
  return newApi.length==oldApi.length&&oldApi.every(ele=>newApi.includes(ele.path))
}

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:140, labelAlign:'right',
  formItems: unref(formItems),
  grid: {cols:2, xGap:30},
  rules:{
    name:[{required: true,message: '菜单名称不能为空！'}],
    icon:[{required: true,message:'菜单图标不能为空！'}],
    sort:[{required: true,message:'显示排序不能为空！'}],
    path:[{required:true, message:'路由地址不能为空！'}]
  },
  submitButtonOptions:{label:'确认', icon:''},
  resetButtonOptions:{label:'取消', icon:''},
  submitOnReset: false,
  action:{
    offset: isMobile.value?0:1
  },
  onSubmit: async (formModel:Recordable|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      const {bindApi, ...rest} = formModel
      if(bindApi&&props?.options&&props?.options?.length>0){
        //判断按钮绑定是否有修改
        if(bindApiNotChange(bindApi,props.data?.apis||[])){
          rest.apis = undefined
        }else{
          rest.apis = []
          bindApi.map((ele:string)=>{
            const [method,path] = ele.split("_")  //method_path
            rest.apis.push({
              menuId: props.data?.id,
              method: method,
              path: path
            })
          })
          // console.log("bindApi",bindApi)
        }
      }

      if(props.isEdit){
        rest.id = props.data?.id
        await menuApi.edit(rest as Recordable)
      }else{
        await menuApi.create(rest as Recordable)
      }
      show.value=false
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))


const colors: {[key:string]:string} = {
  GET:'#00FA9A',
  POST: '#FF8C00',
  PUT: '#00BFFF',
  PATCH: '#2080F0',
  DELETE: '#DC143C'
}

function renderLabel({option}:{option:TreeSelectOption}){
  if(toRaw(option.children)){
    return h('span', null, option.label)
  }else{
    const method = option.method as string;
    return h('div', null, [
      h('span', null, option.label),
      h('span', {
         style: {color:colors[method]},
         class:'ml-8px inline-block w-60px' 
        },
        method.toUpperCase()
      )
    ])
  }
}

async function fetchMenus(){
  const res = await menuApi.getMenusExcludeButton({})
  console.log('menus', res)
  menus.value = res
}

const modalStyle={
  width: '60%',
  minWidth: '680px',
  height:'auto',
  minHeight:'430px',
  maxHeight: '90vh',
  overflowX: 'hidden'
}


// onMounted(()=>{
//   //获取apis下拉框
//   fetchApis()
// })

</script>