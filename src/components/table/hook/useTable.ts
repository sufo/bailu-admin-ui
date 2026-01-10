import { TableColumn, TableProps} from "../types";
import { apiSetting } from "@/settings/apiSetting";
import {isBoolean,isFunction} from 'lodash-es'
import { isResult } from "@/http/helper";
import type { Result } from "~/types/axios";
import type { PaginationProps } from "naive-ui";

export function useTable(tableRef:Ref<any>,
  tableProps: TableProps,
  getPagination:Ref<PaginationProps|boolean>,
  setPagination:(pagination:PaginationProps)=>void,
  loadingRef: Ref<boolean>,
  tableDataRef: Ref<Recordable[]>,
  columnsRef:Ref<TableColumn[]>,
  emit: EmitType){
  
  //记录查询条件  
  let formModel: Recordable;

  const dataSource = ref<Recordable[]>([]);

  const getRowKey = computed(() => {
    const { rowKey }: any = unref(tableProps);
    return rowKey
      ? rowKey
      : () => {
          return 'key';
        };
  });

  const getScrollX = computed(() => {
    let width = 0;
    //是否存在勾选框，存在+60
    const index = unref(columnsRef).findIndex(c=>c.type==='selection')
    if (index!==-1) {
      width += 60;
    }

    const NORMAL_WIDTH = 150; //默认150
    const columns = unref(columnsRef).filter((item) => !item.hide);
    columns.forEach((item) => {
      width += Number.parseFloat(item.width as string) || 0;
    });
    const unsetWidthColumns = columns.filter((item) => !Reflect.has(item, 'width'));

    const len = unsetWidthColumns.length;
    if (len !== 0) {
      width += len * NORMAL_WIDTH;
    }
    const table = unref(tableRef);
    const tableWidth = table?.$el?.offsetWidth ?? 0;
    return tableWidth > width ? '100%' : width;
  });

  //load data
  async function loadData(opt?:any){
    //处理查询条件
    if(opt===undefined){//没有传查询条件则使用上一次的
      opt = formModel
    }else{
      formModel = opt //传入查询条件则记录当前查询条件
    }

    try{
      loadingRef.value = true;
      const { request, pagination, beforeRequest, afterRequest } = tableProps;
      if (!request) return;
      const {
        pageField,
        sizeField,
        countField,
        pagesField,
        listField,
      } = apiSetting.table

      let pageParams:Recordable = {}
      const { page = 1, pageSize = 10 } = unref(getPagination) as PaginationProps;
      const hasPagination = (isBoolean(pagination) && pagination) || !!unref(getPagination)
      if (hasPagination) {
        pageParams[pageField] = (opt && opt[pageField]) || page;
        pageParams[sizeField] = (opt && opt[sizeField]) || pageSize;
      } else {
        pageParams = {};
      }
      
      // console.log("formModel", formModel)
      let params = {
        ...pageParams,
        ...unref(formModel),
        ...opt,
      };
      if (beforeRequest && isFunction(beforeRequest)) {
        // The params parameter can be modified by outsiders
        params = (await beforeRequest(params)) || params;
      }
      const res = await request(params);
      //是否返回原生响应头
      //TODO
      console.log("--------------------------------------")
      console.log("request->result:", res)
      console.log("--------------------------------------")
      //Result
      const result = isResult(res)?(res as Result)[apiSetting.data]:res;
      let data = []
      if(hasPagination){
        data = result[listField] ? result[listField] : [];
      }else{
        data = result
      }
      if (afterRequest && isFunction(afterRequest)) {
        // can modify the data returned by the interface for processing
        data = (await afterRequest(data)) || data;
      }
      dataSource.value = data
      if(hasPagination){
        const pagesCount = result[pagesField];
        // const currentPage = result[pageField];
        const totalCount = result[countField];
        //设置pagination
        setPagination({
          pageCount: pagesCount,
          itemCount: totalCount,
        });
        if (opt && opt[pageField]) {
          setPagination({
            page: opt[pageField] || 1,
          });
        }
      }

    }catch(err){
      console.error(err);
      emit("fetch-err", err)
      dataSource.value = []
    }finally{
      loadingRef.value = false;
      // console.log("loadingRef",loadingRef.value)
    }
  }

  function setTableData(values:Recordable[]) {
    dataSource.value = values;
  }

  //重新从第一页开始查询
  function query(){
    setPagination({ page: 1 });
    loadData()
  }

  //页码切换
  function updatePage(page: number) {
    setPagination({ page: page });
    loadData();
  }

  //分页数量切换
  function updatePageSize(size: number) {
    setPagination({ page: 1, pageSize: size });
    loadData();
  }

  watchEffect(() => {
    tableDataRef.value = unref(dataSource);
  });

  //处理外部数据源
  watch(
    () => unref(tableProps).data,
    () => {
      const { data }: any = tableProps;
      data && (dataSource.value = data);
    },
    {
      immediate: true,
    }
  );

  onMounted(() => {
    //打开页面是否加载数据
    !(tableProps?.disableAutoLoad) && loadData();
  });

  return {
    loadData,
    query,
    getRowKey,
    setTableData,
    updatePage,
    updatePageSize,
    getScrollX
  }

}
