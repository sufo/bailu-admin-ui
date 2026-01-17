
// import { useUserStore } from "@/store/modules"; //这样导入会造成循环引用问题
import { useUserStore } from "@/store/modules/user";
import { SUPER_PERMISSION } from '@/constants/consts'

export function usePermission() {
  const userStore = useUserStore();

  /**
   * 判断是否存在权限
   * 可用于 v-if 显示逻辑
   * 
   * 只要包含accesses的某一项即为拥有该权限
   * */
  function hasPermission(accesses: string | string[] | undefined): boolean {
    if (!accesses || !accesses.length) return true;

    const permissions = toRaw(userStore.permissionList)

    //super
    if (permissions.includes(SUPER_PERMISSION)) return true

    //是数组
    if (Array.isArray(accesses)) {
      return userStore.permissionList?.some((item) => {
        const { value }: any = item;
        return accesses.includes(value);
      });
    } else {
      return permissions.includes(accesses)
    }
  }

  /**
   * 是否包含指定的所有权限
   * @param accesses
   */
  function hasEveryPermission(accesses: string[]): boolean {
    const permissions = userStore.permissionList;

    if (Array.isArray(accesses)) {
      //super
      if (permissions.includes(SUPER_PERMISSION)) return true

      return permissions.every((access: any) => accesses.includes(access.value));
    }
    throw new Error(`[hasEveryPermission]: ${accesses} should be a array !`);
  }

  /**
   * 是否包含其中某个权限
   * @param accesses
   * @param accessMap
   */
  function hasSomePermission(accesses: string[]): boolean {
    const permissions = userStore.permissionList;
    if (Array.isArray(accesses)) {
      //super
      if (permissions.includes(SUPER_PERMISSION)) return true;

      return permissions.some((access: any) => accesses.includes(access.value));
    }
    throw new Error(`[hasSomePermission]: ${accesses} should be a array !`);
  }

  return { hasPermission, hasEveryPermission, hasSomePermission };
}

