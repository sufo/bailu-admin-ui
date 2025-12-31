// 裁剪相关配置类型 interface
interface CropperOptions {
  img: string | ArrayBuffer | null; // 裁剪图片的地址
  info?: boolean; // 裁剪框的大小信息
  outputSize?: number; // 裁剪生成图片的质量 [1至0.1]
  outputType?: 'jpeg'|'png'|'webp'; // 裁剪生成图片的格式
  canScale?: boolean; // 图片是否允许滚轮缩放
  autoCrop?: boolean; // 是否默认生成截图框
  autoCropWidth?: number; // 默认生成截图框宽度
  autoCropHeight?: number; // 默认生成截图框高度
  fixedBox?: boolean; // 固定截图框大小 不允许改变
  fixed?: boolean; // 是否开启截图框宽高固定比例
  fixedNumber?: Array<number>; // 截图框的宽高比例  需要配合centerBox一起使用才能生效
  full?: boolean; // 是否输出原图比例的截图
  canMoveBox?: boolean; // 截图框能否拖动
  original?: boolean; // 上传图片按照原始比例渲染
  centerBox?: boolean; // 截图框是否被限制在图片里面
  infoTrue?: boolean; // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
}

interface CropperPreviewData {
  div: {
    width: string
    height: string
  } //父盒子style
  html: string //预览的html
  img: {
    width: string
    height: string
    transform: string
  } //img的style
  url: string //本地图片链接（剪裁前）
  h: number //高
  w: number //宽
}
