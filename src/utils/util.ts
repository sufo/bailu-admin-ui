/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 09:42:17
 * @Desc: 
 */

import { VNode } from "vue";
import { RouteLocationNormalized, RouteRecordNormalized } from "vue-router";

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
        meta: item.meta,
        name: item.name,
        path: item.path,
      }))
      : undefined) as RouteRecordNormalized[],
  };
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return val === 'undefined' || val === null
}
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}
/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}
function hasOwn(...args: any[]): boolean {
  return !!Object.prototype.hasOwnProperty.call.apply(Object.prototype.hasOwnProperty, args)
}

// 判断是否为 vnode 类型
export function isVNode(node: unknown): node is VNode {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions')
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url);
}

// export function isUrl(path: string): boolean {
//   const reg =
//     /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
//   return reg.test(path);
// }

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}


/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

//首字母转大写
export function firstToUpperCase(str: string): string {
  if (!str || !str.trim()) return str
  else {
    let res = str.charAt(0).toUpperCase()
    if (str.length > 1)
      res += str.slice(1);
    return res
  }
}

//对象值是否相等
export function isObjectValueEqual(a: Recordable, b: Recordable) {
  //取对象a和b的属性名
  let aProps = Reflect.ownKeys(a);
  let bProps = Reflect.ownKeys(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  //循环取出属性名，再判断属性值是否一致
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i] as string;
    let type = typeof a[propName];
    if (type === 'object') {
      //值是对象类型就递归
      if (!isObjectValueEqual(a[propName], b[propName])) {
        return false;
      }
    } else {
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
  }
  return true
}

/**
 * 
 * @param formModel 提交的表单数据
 * @param source 原数据
 * @param excludeField 排除的字段
 * 这里比较以formModel为基准，只比较formModel有的字段
 */
export function isFormDataEqual(formModel: Recordable, source: Recordable, ...excludeField: string[]): boolean {
  const keys = Object.keys(formModel).filter(e => !excludeField.includes(e))
  console.log("keys", keys)
  return keys.every(e => formModel[e] === source[e])
}

/**
 * 数组是否相等，顺序可以不同
 * 注意 数组元素必须为基本类型，如果是对象或者数组，则不支持
*/
export function isArrayEqual(a: Array<string | number | boolean>, b: Array<string | number | boolean>): boolean {
  // console.log("a", a)
  // console.log("b", b)
  return a.length == b.length && a.every(ele => b.includes(ele))
}


// export function isT<T extends object>(v: any, k: string): v is T {
//   return k in v;
// }

/** 
 * 从dom获取css var 
 */
export function getCssVar(key: string, element: HTMLElement = document.documentElement) {
  return window.getComputedStyle(element).getPropertyValue(key)
}

export function deepCopyFunction(func: Function) {
  let copiedFunc = new Function('return ' + func.toString())();

  Object.keys(func).forEach(key => {
    // @ts-ignore
    if (typeof func[key] === 'object' && func[key] !== null) {
      // @ts-ignore
      copiedFunc[key] = deepCopyFunction(func[key]);
    }
  });

  return copiedFunc;
}


// uuid
export function uuid(separator = "-"): string {
  const s: any[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = separator;

  return s.join("");
}