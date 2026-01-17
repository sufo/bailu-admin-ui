
/**解析原始json文件 */
// import icons from './icons.data.js'

// function parseIonicJson(){
//   const _icons = icons.icons.map(icon=>icon.name)
//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(JSON.stringify(_icons));
//   }
// }
// export default parseIonicJson


/**解析原始json文件 */
// import icons from './material-light.data.js'

// function parseMaterialJson(){
//   const cate = icons.categories;
//   const values = Object.values(cate);
//   const _icons = values.flat(icon=>icon.name)
//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(JSON.stringify(_icons));
//   }
// }

// export default parseMaterialJson


/******************ant-design *********************/
// import icons from './ant-design.data.js/index.js'

// function parseAntDesignJson(){
//   const _icons = Object.keys(icons.icons)
//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(JSON.stringify(_icons));
//   }
// }
// export default parseAntDesignJson


/******************carbon *********************/
// import icons from './carbon.data.js'

// function parseCarbonJson(){
//   const cate = icons.categories;
//   console.log("cate",cate)
//   const values = Object.values(cate);
//   const _icons = values.flat(icon=>icon.name)
//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(JSON.stringify(_icons));
//   }
// }
// export default parseCarbonJson

/******************lucide *********************/
// import lucide from './lucide.data.js'

// function parseLucideJson(){
//   const icons = lucide.icons;
//   const _icons = Object.keys(icons)
//   // Windows
//   // exec('clip').stdin.end('some text')
//   // Mac
//   // exec('pbcopy').stdin.end('some text')

//   // Linux
//   // exec('xclip').stdin.end('some text')

//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(JSON.stringify(_icons));
//   }
// }
// export default parseLucideJson


/******************bootstrap *********************/
import bootstrap from './bootstrap.data.js'

function parseBootstrapJson() {
  const icons = bootstrap.icons;
  const _icons = Object.keys(icons)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(_icons));
  }
}
export default parseBootstrapJson