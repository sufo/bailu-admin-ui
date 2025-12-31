/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-06 18:32:10
 * @Desc: 
 */
import type {
  LoadingBarProviderInst,
  DialogProviderInst,
  MessageProviderInst,
  NotificationProviderInst
} from 'naive-ui';
import { CSS_PREFIX } from '@/constants/consts'
import { Result } from './axios';
import { apiSetting } from '@/settings/apiSetting';
import { omit } from 'lodash-es';


declare global {

  interface Window {
    //不出现顶级import，这样就不用在global里面声明了
    //出现顶级import/export,就表示当前文件是模块，这样直接声明的话就不是全局的了
    $loadingBar?: import('naive-ui').LoadingBarProviderInst;
    // $dialog?: import('naive-ui').DialogProviderInst;
    // $message?: import('naive-ui').MessageProviderInst;
    // $notification?: import('naive-ui').NotificationProviderInst;
    $loadingBar?: LoadingBarProviderInst;
    $dialog?: DialogProviderInst;
    $message?: MessageProviderInst;
    $notification?: NotificationProviderInst;
  }

  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  type Nullable<T> = T | null

  type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }
  type Recordable<T = any> = Record<string, T>

  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
  type EmitType = (event: string, ...args: any[]) => void;

  //子组件props类型
  type ChildProps<T> = InstanceType<typeof T>['$props'];
  type PickChildProps<T> = {
    -readonly [K in keyof Omit<ChildProps<T>, keyof VNodeProps | keyof AllowedComponentProps>]: ChildProps<T>[K]
  }


  interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }

  /** 选项数据 
   * checked: 是否默认选中
  */
  type OptionWithKey<K> = { value: K; label: string, isDefault?: boolean };

  type Tree<K> = { key: K; label: string, [x: string]: string, children: Array<Tree<K>> }

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  type OnEvent = (e: MouseEvent | KeyboardEvent) => void;

  //KebabCase
  type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;
  // full kebab
  type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
    ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
    : S;

  type KebabKeys<T> = { [K in keyof T as K extends string ? Kebab<K> : K]: T[K] };

  type CssVars<T extends Record<string, string>, Prefix = typeof CSS_PREFIX> = { [K in T as K extends string ? `--${Prefix}-${KebabCase<K>}` : K]?: string | number; };

  type TimeoutHandle = ReturnType<typeof setTimeout>;

  type ValueOf<T> = T[keyof T];

  //分页
  interface PagesResult<T> extends Result {
    [K in typeof apiSetting.table[keyof[Omit<typeof apiSetting.table, 'list'>]]]: number
    list: T[]
  }

}