/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-09-24 17:54:52
 * @Desc: 
 */
import type { Result } from "~/types/axios";
import { apiSetting } from "@/settings/apiSetting";

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T,
): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}


export function isResult(val: any): val is Result {
  return val && (val[apiSetting.code] === 0 || val[apiSetting.code]) && val[apiSetting.msg]
}

export function isPagesResult(val: any): val is Result {
  return val && (val[apiSetting.code] === 0 || val[apiSetting.code]) && val[apiSetting.msg] && val[apiSetting.data] && val[apiSetting.data][apiSetting.table.listField]
}