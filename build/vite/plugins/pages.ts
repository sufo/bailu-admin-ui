// import Pages from 'vite-plugin-pages'
// import { RouteRecordRaw } from "vue-router"
// // https://github.com/hannoeru/vite-plugin-pages
// export default Pages({
//   //自动读取src/views下的vue文件，生成路由信息，默认路由路径“/”
//   dirs: [{ dir: "src/views", baseRoute: "/" }],
//   //异步方式加载路由组件
//   importMode: 'async',
//   //识别带有vue和md后缀的文件为路由（md文件需要有插件支持）
//   extensions: ['vue', 'md'],
//   exclude: ['**/components/*.vue'],
//   //生成路由处理
//   onRoutesGenerated(routes) {
//     const transformRoute = (route: RouteRecordRaw): RouteRecordRaw => ({
//       ...route,
//       path: route.path.replace('/pages', ''),//这里去掉pages这一层，这里目录仅仅是组织文件的，不需要添加这一层路径
//       children: route.children?.map(transformRoute) ?? [],
//     })
//     return routes.map(transformRoute)
//   },
// })