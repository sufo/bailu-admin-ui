/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-09-25 09:51:22
 * @Desc: 
 */

import { isBoolean } from 'lodash-es';
import { PaginationProps } from 'naive-ui';

// export function usePagination(tableProps: TableProps, show=ref(true), t:any){
export function usePagination(pagination: false | PaginationProps, show = ref(true), t?: any, isMobile?: Ref<boolean> | boolean) {
  const config = ref<PaginationProps>({});
  if (!t) {
    t = useI18n().t
  }

  let _isMobile = false
  if (isMobile !== undefined) {
    _isMobile = isRef(isMobile) ? isMobile.value : isMobile
  }

  watch(
    () => pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        //@ts-ignore
        config.value = {
          ...unref(config),
          ...(pagination ?? {})
        };
      }
    }
  );

  const getPagination = computed((): (PaginationProps | false) => {
    // const { pagination: _pagination} = unref(tableProps);
    const _pagination = pagination;
    if (!unref(show) || (isBoolean(_pagination) && !_pagination)) {
      return false;
    };
    // @ts-ignore
    return {
      page: 1,  //pageIndex
      pageSize: 10,
      pageCount: 0,
      itemCount: 0,
      pageSizes: [
        { value: 10, label: t('layout.table.countPerPage', { n: 10 }) },
        { value: 20, label: t('layout.table.countPerPage', { n: 20 }) },
        { value: 30, label: t('layout.table.countPerPage', { n: 30 }) },
        { value: 40, label: t('layout.table.countPerPage', { n: 40 }) }
      ],
      showSizePicker: !_isMobile,
      showQuickJumper: !_isMobile,
      prefix(pageInfo) { return t('layout.table.totalText', { n: pageInfo.itemCount }) },
      ...(isBoolean(_pagination) ? {} : _pagination),
      ...unref(config),
    }
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPagination);
    //@ts-ignore
    config.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  function getShowPagination() {
    return unref(show);
  }

  return { setPagination, getPagination, setShowPagination, getShowPagination };

}