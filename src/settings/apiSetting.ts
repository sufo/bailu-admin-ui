/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-10-18 11:32:23
 * @Desc: 
 */
export const apiSetting = {
  code: 'code',
  msg: 'msg',
  type: 'type',
  data: 'data',
  table: {
    //页码字段名
    pageField: 'pageIndex',
    // 每页数量字段名
    sizeField: 'pageSize',
    // 接口返回的数据字段名
    listField: 'list',
    // 接口返回总页数字段名
    pagesField: 'pageCount',
    //总数字段名
    countField: 'itemCount',

    defaultPageSize: 10,
    pageSizes: [10, 20, 30, 40, 50],
  }

}
