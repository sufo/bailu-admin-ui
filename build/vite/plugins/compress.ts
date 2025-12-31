/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * https://github.com/anncwb/vite-plugin-compression
 * 编译代码压缩
 */
import compressPlugin from 'vite-plugin-compression';

export default (metaEnv: ImportMetaEnv) => {
  const { VITE_BUILD_COMPRESS = 'gzip', VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE = false } = metaEnv;
  return VITE_BUILD_COMPRESS === 'none'
    ? []
    : compressPlugin({ algorithm: VITE_BUILD_COMPRESS, deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE });
};
