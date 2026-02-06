import { AesEncryption } from '@/utils/cipher'
import { isNullOrUnDef } from '@/utils/util'
import { STORAGE_PRIFIX_KEY } from '@/constants/consts'
import setting from '@/settings/projectSetting'
/** 默认缓存期限为7天 */
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

// aes encryption key
const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

export interface Options {
  storage: Storage
  prefixKey?: string;
  hasEncrypt: boolean;
  key: string;
  iv: string;
  // expire?: Nullable<number>;
}

//
function newAesEncryption(_key?: string, _iv?: string): AesEncryption {
  let key = _key ?? cacheCipher.key
  let iv = _iv ?? cacheCipher.iv
  if ([key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
  }
  return new AesEncryption({ key, iv });
}

/**  
 * localStorage 或者 sessionStorage 
 * 默认sessionStorage
 */
export class WebStorage {
  private storage: Storage;
  private prefixKey?: string;
  private encryption?: AesEncryption
  private hasEncrypt: boolean = true;

  constructor(opt: Partial<Options>) {
    this.hasEncrypt = opt.hasEncrypt !== undefined ? opt.hasEncrypt : import.meta.env.PROD;
    if (this.hasEncrypt) {
      // let key = opt.key ?? cacheCipher.key
      // let iv = opt.iv ?? cacheCipher.key
      // if ([key.length, iv.length].some((item) => item !== 16)) {
      //   throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
      // }
      // this.encryption = new AesEncryption({ key, iv });
      this.encryption = newAesEncryption(opt.key, opt.iv);
    }
    this.storage = opt.storage ? opt.storage : sessionStorage;
    this.prefixKey = opt.prefixKey ? opt.prefixKey : STORAGE_PRIFIX_KEY;
  }

  private getKey(key: string) {
    return `${this.prefixKey}-${key}`.toUpperCase();
  }

  /**
   * 
   * @param key 
   * @param value 
   * @param expire 
   */
  set(key: string, value: unknown, expire: number | null = DEFAULT_CACHE_TIME, isEncrypt: boolean = this.hasEncrypt) {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
    });
    const stringifyValue = isEncrypt
      ? this.encryption?.encryptByAES(stringData)
      : stringData;
    this.storage.setItem(this.getKey(key), stringifyValue as string);
  }


  get<T = any>(key: string, defaultVal: T | null = null, isEncrypt: boolean = this.hasEncrypt): T {
    const rawVal = this.storage.getItem(this.getKey(key));
    if (!rawVal) return defaultVal as T;

    try {
      const val = isEncrypt ? this.encryption?.decryptByAES(rawVal) : rawVal;
      const data = JSON.parse(val!);
      const { value, expire } = data
      if (isNullOrUnDef(expire) || expire >= Date.now()) {
        return value as T;
      }
      this.remove(key);
      return null as unknown as T
    } catch (e) {
      return defaultVal as T
    }
  }

  /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
  remove(key: string) {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * @param keys 
   */
  removes(...keys: string[]) {
    keys.forEach(k => this.storage.removeItem(k))
  }
  /**
   * Delete all caches of this instance
   */
  clear(): void {
    this.storage.clear();
  }

  /**
     * 设置cookie
     * @param {string} name cookie 名称
     * @param {*} value cookie 值
     * @param {number=} expire 过期时间
     * 如果过期时间为设置，默认关闭浏览器自动删除
     * @example
     */
  // setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
  //   document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
  // }
  setCookie(name: string, value: any, isEncrypt: boolean = false, expire: number | null = DEFAULT_CACHE_TIME) {
    if (isEncrypt || this.hasEncrypt) {
      let enc = this.encryption
      if (!enc) enc = newAesEncryption()  //使用默认
      value = enc.encryptByAES(value)
    }
    document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
  }

  /**
   * 根据名字获取cookie值
   * @param name
   */
  // getCookie(name: string): string {
  //   const cookieArr = document.cookie.split('; ');
  //   for (let i = 0, length = cookieArr.length; i < length; i++) {
  //     const kv = cookieArr[i].split('=');
  //     if (kv[0] === this.getKey(name)) {
  //       return kv[1];
  //     }
  //   }
  //   return '';
  // }
  getCookie<T = string>(name: string, defVal: T | null = null, needDecrypt: boolean = false): T {
    const cookieArr = document.cookie.split('; ');
    let enc = this.encryption
    if (needDecrypt || this.hasEncrypt) {
      if (!enc) enc = newAesEncryption()  //使用默认
    }
    for (let i = 0, length = cookieArr.length; i < length; i++) {
      const kv = cookieArr[i].split('=');
      if (kv[0] === this.getKey(name)) {
        let v = kv[1];
        if (needDecrypt || this.hasEncrypt)
          v = v ? (enc?.decryptByAES(v) || '') : ''
        return v as T;
      }
    }
    return defVal as unknown as T;
  }

  /**
   * 根据名字删除指定的cookie
   * @param {string} key
   */
  removeCookie(key: string) {
    this.setCookie(key, 1, false, -1);
  }

  /**
   * 清空cookie，使所有cookie失效
   */
  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;expire=' + new Date(0).toUTCString();
      }
    }
  }
}


export const createLocalStorage = (opt: Partial<Options> = {}) => {
  opt.storage = localStorage
  return new WebStorage(opt)
}

export const createSessionStorage = (opt: Partial<Options> = {}) => {
  opt.storage = sessionStorage
  return new WebStorage(opt)
}

const { storageModel } = setting.app;
const isLocal = storageModel === 'LOCAL';

const prefixKey = import.meta.env.VITE_APP_NAMESPACE
export const storage = isLocal ? createLocalStorage({ prefixKey }) : createSessionStorage({ prefixKey })
export default storage
