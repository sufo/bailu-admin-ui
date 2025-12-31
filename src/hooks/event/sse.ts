/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-09-12 13:57:06
 * @Desc: 
 */

export interface EventSrouceOptions extends EventSourceInit {
  onopen?: (e: Event) => void;
  onmessage?: (data: any) => void;
  onerror?: (error: Event) => void
}

let eventSource: EventSource | undefined = undefined


function init(url: string, options: EventSrouceOptions) {
  //实例化EventSource
  // withCredentials: 跨域请求是否带上cookie
  eventSource = new EventSource(url, { withCredentials: options.withCredentials || false })

  //EventSource打开
  if (options?.onopen)
    eventSource.addEventListener('open', options.onopen)

  //EventSource接收到新消息
  if (options?.onmessage) {
    eventSource.addEventListener('message', (event) => {
      try {
        // console.log("message-event", event)
        if (event.data && typeof event.data === 'string') {
          let data = JSON.parse(event.data);
          //业务逻辑回调
          options!.onmessage?.(data)
        }
      } catch (error) {
        console.log('EventSource初始化异常', error);
      }
    });
  }

  //EventSource错误
  if (options?.onerror) {
    eventSource.onerror = function (error) { // 监听错误
      console.log('EventSource连接错误', error);
      options!.onerror?.(error)
      _close(options);
    }
  }
}

//关闭eventSource
function _close(options: EventSrouceOptions) {
  if (eventSource) {
    if (options.onopen)
      eventSource.removeEventListener('open', options.onopen)
    if (options.onmessage)
      eventSource.removeEventListener('message', options.onmessage)
    if (options.onerror)
      eventSource.removeEventListener('error', options.onerror)
    eventSource.close();
    eventSource = undefined;
  }
}


export function useEventSource(url: string, options: EventSrouceOptions = {}): EventSource | undefined {

  //兼容判断
  if ('EventSource' in window) {
    if (!eventSource)
      init(url, options)
  }
  else {
    throw new Error('浏览器不支持EventSource对象')
  }
  return eventSource
}