
<!--带选中状态的dropdown-->
<script lang="ts">
import type { DropdownProps } from 'naive-ui';
import {NDropdown} from 'naive-ui'
import type { VNodeChild ,Component,PropType} from 'vue';
import Icon from '@/components/icon/src/Icon.vue'

export interface State{
    icon: string
    color?: string
    size?: string | number,
    spin?: boolean,
    show?: boolean,
    active?: number,
    position?: 'start' | 'end'
}

// const props = {
//     state:{
//         type: Object as PropType<State>,
//         default: ()=>({
//             icon:String,
//             size: [String,Number] as PropType<string | number>,
//             spin: {
//                 type: Boolean,
//                 default: false,
//             },
//             show:{
//                 type: Boolean,
//                 default: true
//             },
//             position:{
//                 type: String as PropType<'start' | 'end'>,
//                 default: 'end'
//             }  
//         })   
//     }
// }

// const defaultState = {
//   type: Object as PropType<State>,
//   default: ()=>({
//       // icon:String,
//       color: 'var(--color-primary)',
//       size: '1em',
//       spin: false,
//       show:true,
//       position:'end'
//   })   
// }

//设样设计让没有传入的属性也有默认值
const defaultState = {
  // icon:String,
  active: 0,
  color: 'var(--primary-color)',
  spin: false,
  show:true,
  position:'end'
}

// const dropdownProps = mergeProps(DropdownProps, props)

export default defineComponent({
  name: 'StateDropdown',
  inheritAttrs:false,
  props:{
    state:{
      type: Object as PropType<State>,
      default: ()=>(defaultState)
    }
  },

  setup(props,{slots,attrs}) {
    // const show = mergeProps(ref(false),  toRef(props, 'show'))
    // const mergedShowRef = (toRef(props, 'show'), show);
    const state = computed(()=>{
      return Object.assign(defaultState, props.state)
    })

    // console.log("state", state.value)
    const clickIndex = ref(state.value.active)
    const nDropdown = ref()
    // @ts-ignore
    const hIcon = (v,i:number): VNodeChild => {
        const tNode = h('div', { class: 'flex-1 z-1 mr-8px' }, v.label)
        let nodes:VNodeChild[] = [tNode]
        if (state.value.show && clickIndex.value===i)
            nodes.push(h(Icon as Component, { class: 'z-1', ...(state.value) }))
        
        if(state.value.position=='start')
            nodes = nodes.reverse()
        return h(
            'div',
            {
                class: 'drop-item flex-center cursor-pointer px-16px py-6px',
                onClick: () => { 
                  if(state.value.show){
                    nDropdown.value.doUpdateShow(false);
                    if(attrs.onSelect&&typeof(attrs.onSelect)==='function'){
                      if(clickIndex.value === i) return; //表示点击的是同一个
                      attrs.onSelect(v.key,v.label, i)
                    }
                    clickIndex.value = i
                  }
                }
            },
            nodes
      )
    }

    (attrs.options as DropdownProps["options"])?.forEach((e,i) => {
      e.type = 'render'
      e.render = ()=>hIcon(e,i)
    });
    // console.log("options", attrs.options)

    //render写在setup里面得写法
    return ()=>{
      return h(NDropdown as Component,  {...attrs, ref:nDropdown}, ()=>[slots.default&&slots.default({class:'cursor-pointer'})])
    }
  },
  
  // render(){
      // console.log("slots",this.$slots)
      // return h(NDropdown as Component, {props:this.$props}, [this.$slots.default && this.$slots.default()])
  // }

})

</script >
<style lang="scss" scoped>
.drop-item:hover{
    position: relative;
  &::before {
      background-color: var(--n-option-color-hover);
  }
    &::before {
      content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 4px;
    right: 4px;
    transition: background-color .3s var(--n-bezier);
    border-radius: var(--n-border-radius);
  }
}
  </style>