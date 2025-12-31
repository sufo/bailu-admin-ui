<template>
  <div class="bailu-dynamic-tags" :style="{'--text-color':textColor}">
    <span class="flex items-center" v-for="(v,index) in valuesRef" :key="index" @contextmenu.prevent="showContextMenu($event)">
        <slot name="label" :close="handleCloseClick" :tag="v" :index="index" :editable="editable" :itemClick="itemClick">
          <div v-show="!v.isEdit" 
            :class="['tag',tagClass, {'tag-active':index===activeIndex}]" 
            :style="tagClass" @click="itemClick(v,index)">
            <span>{{ v.label }}</span>
            <n-button v-if="closable" tertiary @click.prevent="handleCloseClick(v,index)" :render-icon="r({'icon':'bi:x',size:14})"></n-button>
          </div>
        </slot>
        <slot name="input" :tag="v" :keyDown="handleInputKeyDown", :blur="handleInputBlur">
          <n-input v-model:value="v.label" v-show="v.isEdit"
            @keydown="handleInputKeyDown" @blur.prevent="handleInputBlur"
            :internal-force-focus="!v.isEdit"
            :class="{canEdit: v.isEdit}"
            autosize />
        </slot>
        <slot name="add" v-if="canCreate"
          :show="index+1===valuesRef.length&&(!lastTag||!lastTag.isEdit)"
          :disabled="triggerDisabledRef" 
          :click="handleAddClick">
          <n-button dashed class="d-button" :size="size"
            v-if="index+1===valuesRef.length&&(!lastTag||!lastTag.isEdit)"
            :disabled="triggerDisabledRef" 
            @click.prevent="handleAddClick">
            <icon icon="bi:plus" size="20"/>
          </n-button>
        </slot>
    </span>
    <ContextMenu
          v-if="(menuProps&&menuProps.show)&&showMenu"
          @ClickOutside="showMenu=false"
          v-bind="menuProps"
      />
  </div>
  </template>
  <script lang="ts" setup>
  import type {DynamicTagProps,TagOption} from './types'
  import { useIconRender } from '@/components/icon';
  import { usePreferenceStore } from '@/store/modules';
  import {deepCopyFunction} from '@/utils/util'

  function call(funcs: (...args:Array<any>)=>any|Array<(...args:Array<any>)=>any>, ...args:Array<any>) {
    if (Array.isArray(funcs)) {
      funcs.forEach(func => call(func, ...args));
    } else {
      return funcs(...args);
    }
  }
  
  // const emit = defineEmits(["update:value"])
  
  // const values = computed({
  //   get:()=>props.value,
  //   set:(val:TagsOption)=>emit('update:value')
  // })
  defineSlots<{
    label : (props:{
      tag: TagOption,
      index: number,
      close:(tag:TagOption,index:number)=>void,
      editable: (tag:TagOption)=>void,
      itemClick: (tag:TagOption,index:number)=>void
    })=>void,
    input : (
      tag: TagOption,
      keyDown: (e:Event)=>void,
      blur: (e:Event)=>void,
    )=>void,
    add: (
      show:boolean,
      disabled: boolean,
      click: (e:Event)=>void,
    )=>void,
  }>()
  
  defineOptions({name:"DynamicTags"})
  const {r} = useIconRender()
  const {t} = useI18n()
  //context menu
  const showMenu = ref(false)
  const activeIndex=ref(0)
  const preference = usePreferenceStore()
  //颜色处理
  // const isDark = colord(getCssVar('--primary-color')).isDark()
  const textColor = computed(()=>{
     return preference.isDarkPrimaryColor?'#ffffff':'#000000'
  })
  
  const props = withDefaults(defineProps<DynamicTagProps>(),{
    closable:true,
    size: 'small',
    onSave: (label:string)=>({label,value:'',isEdit:false} as TagOption),
  })
  
  const valuesRef = toRef(props,'value');
  // 没有放到props里面定义，因为报错：
  // `defineProps()` in <script setup> cannot reference locally declared variables because it will be hoisted outside of the setup()
  const menuProps = computed(()=>{
    if(props.contextMenu){
      if(props.contextMenu&&props.contextMenu.show){
        let actions = props.contextMenu.actions

        //给默认修改按钮
        if(!actions||actions.length==0){
          props.contextMenu.actions = [{ 
            label: t('button.edit'), action: 'edit',
            handler: async (tag:TagOption)=>{
                tag.isEdit = true
                nextTick(()=>{
                  inputFocus()
                })
                return true
            }
          }]
        }
        props.contextMenu.actions!.forEach(a=>{
          //对handler进行一层包装，做一些额外的处理
          //深拷贝函数
          const h = deepCopyFunction(a.handler)
          a.handler = ()=>ctxMenuActionProxy(h)
        })
        
        return props.contextMenu
      }
    }
    return undefined
  })
  
  async function ctxMenuActionProxy(handler:(tag:TagOption)=> boolean|Promise<boolean>){
    //查找点击的DOM，获取label
    // console.log("h",handler)
    const span = (menuProps.value?.e?.target! as HTMLElement)
    const tag = valuesRef.value.find(e=>e.label===span.textContent)
    let res = false
    if(tag){
      res = await handler(tag)
      showMenu.value = res  //关闭右键菜单
    }else{
      console.log("未找到作用的DOM")
    }
    return res
  }
  
  function showContextMenu(e:MouseEvent){
    console.log("eeee",e)
    menuProps.value!.e = e
    showMenu.value = true;
  }
  
  const lastTag = computed(()=>{
    const v = valuesRef.value
    if(!v || v.length==0){
      return ""
    }else{
      return v[v.length-1]
    }
  })
  
  const currentTag = computed({
    get: ()=>valuesRef.value.find(e=>e.isEdit),
    set: (val:TagOption)=>{
      let tag = valuesRef.value.find(e=>e.isEdit)
      tag = Object.assign(tag||{},val)
    }
  })
  
  const triggerDisabledRef = computed(() => {
        return props.disabled || !!props.max && props.value.length >= props.max;
  });
  
  function editable(val:TagOption){
    val.isEdit = true
    nextTick(()=>{
      inputFocus()
    })
  }
  
  function doChange() {
    const {
      'onUpdate:value': _onUpdateValue,
      onUpdateValue
    } = props;
   
    if (onUpdateValue) call(onUpdateValue, valuesRef.value);
    if (_onUpdateValue) call(_onUpdateValue, valuesRef.value);
  }
  function handleCloseClick(v:TagOption,index:number) {
    if(props.onRemove){
      props.onRemove(v,index)
    }else{
      valuesRef.value.splice(index,1)
    }
    doChange();
  }
  function handleInputKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        handleInputConfirm();
    }
  }
  async function handleInputConfirm() {
    const nextTag = currentTag.value
    if (nextTag&&nextTag.label) {
      const res = await props.onSave(nextTag)
      if(res){
        nextTag.isEdit = false
        doChange();
      }
    }else{
      const index = valuesRef.value.findIndex(e=>e.isEdit)
      if(index != -1){
        if(nextTag!.value){ //说明是删除操作
          if(props.onRemove){
            props.onRemove(nextTag!,index)
          }
        }
        valuesRef.value.splice(index,1)
      }
    }
  }
  
  function handleInputBlur(e: Event) {
    // const target = e.target as HTMLInputElement
    handleInputConfirm()
  }
  function handleAddClick(e:Event) {
    valuesRef.value.push({
      label:"",value:"",isEdit:true
    })
    void nextTick(() => {
      inputFocus()
    });
  }
  
  //处理input获取焦点
  function inputFocus(){
    const ele = document.querySelector(".canEdit input")
    if(ele){
      (ele as HTMLInputElement).focus()
    }
  }
  
  function itemClick(tag: TagOption,index:number){
    activeIndex.value = index
    if(props.onItemClick){
      props.onItemClick(tag)
    }
  }
  
  //触发change处理
  watch(
    activeIndex,
    (index)=>{
      if(props.onChange){
        props.onChange(valuesRef.value[index])
      }
    }
  )
  
  defineExpose({inputFocus, editable})
  
</script>
<style>
.bailu-dynamic-tags{
  display: flex;
  flex-flow: wrap;
  justify-content: flex-start;
  gap: 6px 8px;
  --n-input-width: 64px;
  .tag{}
  .n-input{
    width: auto;
    min-width: var(--n-input-width);
    height: 37px;
    /* & input{width:0;min-width:var(--n-input-width);} */
  }
  .n-button{height:39px;width: 46px;font-size:18px;margin-left:4px;}

  .tag.tag-active{
    background-color: var(--primary-color-pressed);
    color: var(--text-color);
  }
}
.bailu-dynamic-tags .tag {
  white-space: nowrap;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: var(--padding);
  border-radius: var(--border-radius);
  background-color: rgb(250, 250, 252);
  transition: border-color .3s var(--n-bezier), background-color .3s var(--n-bezier), color .3s var(--n-bezier), box-shadow .3s var(--n-bezier), opacity .3s var(--n-bezier);
  height: 39px;
  line-height: 1;
  font-size: 14px;
}
.bailu-dynamic-tags .tag .n-button{
  margin-left: 6px;
  width: 16px;
  height:16px;
  padding:0;
}
.dark .bailu-dynamic-tags .tag{
  background-color: rgb(16 16 20);
}
.dark .bailu-dynamic-tags .tag-active{
  background-color: var(--primary-color-pressed);
}
</style>