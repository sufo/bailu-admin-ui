/**元素宽度拖拽*/
// export default function useDragX<T extends HTMLElement = HTMLDivElement>(minWidth: number = 0, maxWidth: number = 0) {
//   if (maxWidth == 0) maxWidth = document.documentElement.clientWidth
//   return (evt: MouseEvent|DragEvent) => {
//     let oDiv = evt.target as T; //当前元素
//     let disX = evt.clientX - oDiv?.offsetLeft;
//     let disY = evt.clientY - oDiv?.offsetTop;
//     document.onmousemove = function (e) {
//       //通过事件委托，计算移动的距离
//       let l = e.clientX - disX;
//       let t = e.clientY - disY;
//       if (l < minWidth) {
//         //如果左侧的距离小于0，就让距离等于0.不能超出屏幕左侧。如果需要磁性吸附，把0改为100或者想要的数字即可
//         l = 0;
//       } else if (l > maxWidth - oDiv.offsetWidth) {
//         //maxWidth=document.documentElement.clientWidth: 如果左侧的距离>屏幕的宽度-元素的宽度。也就是说元素的右侧超出屏幕的右侧，就让元素的右侧在屏幕的右侧上
//         //maxWidth 如果左侧的距离>maxWidth-元素的宽度。限制拖动距离
//         l = document.documentElement.clientWidth - oDiv.offsetWidth;
//       }
//       if (t < 0) {
//         //和左右距离同理
//         t = 0;
//       } else if (t > document.documentElement.clientHeight - oDiv.offsetHeight) {
//         t = document.documentElement.clientHeight - oDiv.offsetHeight;
//       }
//       //移动当前元素
//       oDiv.style.left = l + "px";
//       oDiv.style.top = t + "px";
//     };
//     document.onmouseup = function (e) {
//       document.onmousemove = null;
//       document.onmouseup = null;
//     };
//     // 解决有些时候,在鼠标松开的时候,元素仍然可以拖动;
//     document.ondragstart = function (ev) {
//       ev.preventDefault();
//     };
//     document.ondragend = function (ev) {
//       ev.preventDefault();
//     };
//     return false;

//   }
// }

/**
 * 
 * @param targetRef 改变宽度的目标dom
 * @param minWidth 
 * @param maxWidth 
 * @mouseoutCallback 
 * @returns 
 */
export default function useDragX<T extends HTMLElement = HTMLDivElement>(minWidth: number = 0, maxWidth: number = 0, mouseoutCallback?: (width: number) => void) {
  if (maxWidth == 0) maxWidth = document.documentElement.clientWidth
  return (evt: MouseEvent) => {
    let oDiv = evt.target as T; //当前元素
    if (!oDiv) return;
    const target = oDiv.parentNode as HTMLElement
    if (!target) return;
    let disX = evt.clientX - oDiv?.offsetLeft;
    let disY = evt.clientY - oDiv?.offsetTop;
    target.style.transition = 'unset';

    document.onmousemove = function (e) {
      //通过事件委托，计算移动的距离
      let l = e.clientX - disX;
      let t = e.clientY - disY;
      if (l < minWidth) {
        //如果左侧的距离小于0，就让距离等于0.不能超出屏幕左侧。如果需要磁性吸附，把0改为100或者想要的数字即可
        // l = 0;
        l = minWidth
      } else if (l > maxWidth - oDiv.offsetWidth) {
        //maxWidth=document.documentElement.clientWidth: 如果左侧的距离>屏幕的宽度-元素的宽度。也就是说元素的右侧超出屏幕的右侧，就让元素的右侧在屏幕的右侧上
        //maxWidth 如果左侧的距离>maxWidth-元素的宽度。限制拖动距离
        l = maxWidth - oDiv.offsetWidth;
      }
      if (t < 0) {
        //和左右距离同理
        t = 0;
      } else if (t > document.documentElement.clientHeight - oDiv.offsetHeight) {
        t = document.documentElement.clientHeight - oDiv.offsetHeight;
      }
      //移动当前元素
      oDiv.style.left = l + "px";
      oDiv.style.top = t + "px";
      // target.style.width = l + "px";
      // mouseoutCallback?.(l) //宽度不停的改变

      /**很重要，否则可能出现拖动后还需要再次点击才能使拖动生效 */
      return false;
    };
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
      target.style.transition = 'width 0.2s';
      mouseoutCallback?.(parseInt(oDiv.style.left))//宽度在鼠标放开时改变
      //@ts-ignore
      target.releaseCapture?.();
    };
    //@ts-ignore
    target.setCapture?.();
    return false;

  }
}





