import { isVNode, Fragment, Comment, Text, h } from 'vue';
import isPlainObject from 'lodash-es/isPlainObject';

const isValid = (value) => {
  return value !== undefined && value !== null && value !== '';
};
export const flattenChildren = (children = [], filterEmpty = true) => {
  const temp = Array.isArray(children) ? children : [children];
  const res = [];
  temp.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...flattenChildren(child, filterEmpty));
    } else if (child && child.type === Fragment) {
      res.push(...flattenChildren(child.children, filterEmpty));
    } else if (typeof child.type === 'symbol') {
      res.push(...flattenChildren(child, filterEmpty));
    } else if (child && isVNode(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        res.push(child);
      } else if (!filterEmpty) {
        res.push(child);
      }
    } else if (isValid(child)) {
      res.push(child);
    }
  });
  return res;
};

export function isEmptyElement(c) {
  return (
    c &&
    (c.type === Comment ||
      (c.type === Fragment && c.children.length === 0) ||
      (c.type === Text && c.children.trim() === ''))
  );
}

export function isEmptySlot(c) {
  return !c || c().every(isEmptyElement);
}

export function isStringElement(c) {
  return c && c.type === Text;
}

export function mergeProps() {
  const args = [].slice.call(arguments, 0);
  const props = {};
  args.forEach((p = {}) => {
    for (const [k, v] of Object.entries(p)) {
      props[k] = props[k] || {};
      if (isPlainObject(v)) {
        Object.assign(props[k], v);
      } else {
        props[k] = v;
      }
    }
  });
  return props;
}

//将后者的undefine属性去掉，避免前者被后者的undefined覆盖
// export function combineProps<T extends {}, U extends {[x:string]:any}>(target: T, source: U): T & U{
//   Object.keys(source).forEach(k=>{
//     if(typeof source[k]==='undefined' || source[k]===null){
//       delete source[k]
//     }
//   })
//   return Object.assign(target, source)
// }

/**
 * 将source的undefine属性去掉，避免同名属性target被source的undefined覆盖
 * @param {*} target 
 * @param {*} source  
 * @returns 
 */
export function combineProps(target, source) {
  Object.keys(source).forEach(k => {
    if (typeof source[k] === 'undefined' || source[k] === null) {
      delete source[k]
    }
  })
  return Object.assign(target, source)
}