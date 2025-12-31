import { Directive,App } from "vue";

interface Font {
  size?: number;
  family?: string;
  weight?: number|string
}
export interface Option {
  open: boolean; //是否开启
  class: string; //class
  textAlign?:CanvasTextAlign;
  textBaseline?:CanvasTextBaseline;
  font?: Font;
  fillStyle?: string | CanvasGradient | CanvasPattern;  // "rgba(180, 180, 180, 0.3)", // 描边样式
  text?: string[];
  width?: number;
  height?: number;
  lineHeight?:number;
  deg?: number;  //旋转角度
  left?: number; // 整体背景距左边的距离
  top?: number; // 整体背景距上边的距离
  gap?: [number,number];
  zIndex: number;
}


class WaterMark {

  public options:Option;
  private targetEl:HTMLElement;
  static readonly dpr = window.devicePixelRatio;
  private waterMarkEl:HTMLDivElement|undefined;
  private observer:MutationObserver;
  static readonly style = `
  display: block;
  overflow: hidden;
  position: absolute;
  bottom:0;
  right:0;
  background-repeat: repeat;
  pointer-events: none;`;


  private defaultOptions:Option={
    open: false,
    class: 'water-mark',  //默认class
    textAlign:'center',
    textBaseline:'middle',
    deg:-20, 
    left:20, 
    top:20,
    gap:[120, 40],
    font:{
      weight:'normal',
      size: 20,
      family:'Arial'
    },
    fillStyle:"rgba(180, 180, 180, 0.3)",
    text:[],
    zIndex: 9
  }

  constructor(targetEl:HTMLElement,options:Option){
    this.targetEl = targetEl
    //如果text是string类型，则转成[]
    if(options.text&& typeof(options.text)=='string'){
      options.text = [options.text]
    }
    this.options = Object.assign({}, this.defaultOptions,options)
    //处理行高，如果为设置行高，默认行高=fontsize+4
    this.options.lineHeight = this.options.font!.size!+4

    // 监听 DOM 变化
    this.observer = new MutationObserver((mutationsList) => {
      const waterMarkEl = targetEl.parentElement?.querySelector(".water-mark");

      if (mutationsList.length) {
        const { removedNodes, type, target } = mutationsList[0];
        const currStyle = waterMarkEl?.getAttribute("style");
  
        // 证明被删除了
        if (removedNodes[0] === waterMarkEl) {
          this.observer?.disconnect();
          this.render();
        } else if (
          type === "attributes" &&
          target === waterMarkEl &&
          currStyle !== WaterMark.style
        ) {
          // waterMarkEl.setAttribute("style", style);
          (waterMarkEl as HTMLDivElement).style['position'] = 'relative'
        }
      }
    });
    this.observer.observe(targetEl.parentElement!, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }

  getFont(){
    const {size, family,weight} = this.options.font!
    return `${weight} ${size}px ${family}`
  }

  //计算绘制texts的实际高度
  measureText(texts:string[], font:Font, deg:number){
    if(!texts || texts.length==0){
      return [0,0]
    }
    const canvas = document.createElement('canvas');
    const ctx =canvas.getContext('2d');
    if(ctx){
      const {size,family,weight} = font
      ctx.font = `${weight} ${size}px ${family}`

      var text = texts.reduce((max:string,current)=>{return max.length>current.length?max:current}, '');
      // 根据需要切割结果，动态改变canvas的宽和高
      const metrics = ctx.measureText(text)
      // const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; 
      // 当前文本字符串在这个字体下用的实际高度
      // const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent; 

      const actualHeight = this.options.lineHeight! * texts.length
      const degToPI = (Math.PI * deg) / 180;
      const absDeg = Math.abs(degToPI);
      // 根据旋转后的矩形计算最小画布的宽高
      const hSinDeg = actualHeight * Math.sin(absDeg);
      const hCosDeg = actualHeight * Math.cos(absDeg);
      const wSinDeg = metrics.width * Math.sin(absDeg);
      const wCosDeg = metrics.width * Math.cos(absDeg);

      // const  width = parseInt(hSinDeg + wCosDeg + gap[0]! + '', 10);
      // const height = parseInt(wSinDeg + hCosDeg + gap[1] + '', 10);
      const  width = parseInt(hSinDeg + wCosDeg + '', 10);
      const height = parseInt(wSinDeg + hCosDeg + '', 10);
      // return [width, height, width/text.length]  // [宽、高、单个字符所占宽度]
      return [width, height, metrics.width/text.length, actualHeight]  // [宽、高、单个字符所占宽度]
    }
    return [0,0,0]
  }

  // getCanvasSize():[number,number]{
  //   const {text, font,deg, width,height} = this.options
  //   if(width&&height){
  //     return [width,height]
  //   }else{
  //     if(!text || text.length==0)
  //       return [0,0]
  //     else{
  //       const [w,h] = this.measureText(text!,font!, deg!)
  //       if (width)
  //         return [width, h]
  //       else
  //         return [w,height!]
  //     }
  //   }
  // }
  getCanvasSize(w: number,h:number):[number,number]{
    const {text, width,height} = this.options
    if(!text || text.length==0)
      return [0,0]
    if(width&&height){
      return [width,height]
    }else{
      if (width)
        return [width, h]
      else if(height)
        return [w, height]
      else
        return [w,h]
    }
  }

  // caclDrawOffset(w:number,h:number){
  //   function getY(textBaseline:CanvasTextBaseline,size:number, h:number){
  //     let y = 0
  //     if(textBaseline=='top')
  //       y = 0
  //     else if(textBaseline=='middle')
  //       // y =(lineHeight!-size!)/2
  //       // y = (h-size)!/2
  //       y = h/2
  //     else if(textBaseline=='bottom')
  //       // y = lineHeight!-size!
  //       // y = (h-size)!
  //       y = h!
  //     return y
  //   }
  //   const {textAlign, textBaseline, lineHeight, font} = this.options
  //   const fontSize = font?.size!
  //   let x=0;
  //   if(textAlign=='left' || textAlign=='start')
  //     x = 0
  //   else if(textAlign=='center')
  //     x = 0
  //   else if(textAlign=='end' || textAlign=='right')
  //     x = w
  //   return [x, getY(textBaseline!,fontSize, h)]
  // }

  getDataUrl({text,deg,gap,fillStyle,textAlign,textBaseline,font, lineHeight}:Option){
    if(!text || text.length==0) return ''
    
    const canvas = document.createElement("canvas")
    const [w,h,_,fw] = this.measureText(text,font!,deg!)
    const [cw,ch] = this.getCanvasSize(w,h)
     // canvas.width = 120;
    // canvas.height = 60;
    canvas.width = (cw+gap![0])*WaterMark.dpr;
    canvas.height = (ch+gap![1])*WaterMark.dpr;
    // canvas.width = cw*WaterMark.dpr;
    // canvas.height = ch*WaterMark.dpr;
    const ctx = canvas.getContext("2d"); // 获取画布上下文
    if(ctx){
      const {size,family,weight} = font!
      ctx.font = `${weight} ${size}px ${family}`;
      //中心旋转
      ctx.translate(cw/2, ch/2)
      ctx.rotate((deg! * Math.PI) / 180);
      ctx.translate(-(cw/2), -(ch/2));

      ctx.fillStyle = fillStyle!;
      ctx.textAlign = textAlign!;
      ctx.textBaseline = textBaseline!;
    }
    text.forEach((t,index)=>{
      // const drawY = index * WaterMark.dpr*lineHeight!
      ctx?.fillText(t, cw/2, (index*lineHeight!+fw/2)*WaterMark.dpr);
    })
    return canvas.toDataURL("image/png");
  }

  render(){
    const opt = this.options
    if(!opt.open) return
    const { parentElement } = this.targetEl;
    // 获取对应的 canvas 画布相关的 base64 url
    const url = this.getDataUrl(opt);

    // 创建 waterMark 父元素
    this.waterMarkEl = document.createElement("div")
    this.waterMarkEl.className = this.options.class; // 方便自定义展示结果
    const style = `${WaterMark.style}left:${opt.left}px;top:${opt.top}px;z-index:${opt.zIndex};background-image: url(${url});`;
    this.waterMarkEl.setAttribute("style", style);
    // 将对应图片的父容器作为定位元素
    // parentElement?.setAttribute("style", "position: relative;"); //这样会覆盖
    if(parentElement){
      parentElement.style['position'] = 'relative'
      // 将图片元素移动到 waterMark 中
      parentElement.appendChild(this.waterMarkEl);
    }

  }

  destroy(){
    if(this.targetEl && this.waterMarkEl){
      const { parentElement } = this.targetEl;
      if(this.observer){
        this.observer.disconnect()
      }
      parentElement?.removeChild(this.waterMarkEl)
      this.waterMarkEl = undefined
    }
  }

  hide(){
    if(this.waterMarkEl){
      this.waterMarkEl.style.display = "none"
    }
  }

  show(){
    if(this.waterMarkEl){
      this.waterMarkEl.style.display = "inline-block"
    }else{
      this.render()
    }
  }
}



let waterMark:WaterMark

// 定义指令配置项
const directives: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const opt = binding.value
    if(opt?.open){
      waterMark = new WaterMark(el,opt)
    }
  },
  updated(el, binding, vnode, prevVnode) {
    const opt = binding.value
    if(!waterMark){
      waterMark = new WaterMark(el,opt)
    }
    if(!opt?.open){
      waterMark.hide()
    }else{
      waterMark.render()
    }
  },
  unmounted(el){
    if(waterMark){
      waterMark.destroy()
    }
  }
};

export default function setWatermarkDirective(app:App){
  app.directive('watermark', directives)
}













