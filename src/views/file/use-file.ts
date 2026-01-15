import { fileApi } from '@/api/admin'
import { TagOption } from '@/components/custom/dynamic-tags/types';
import { usePagination } from '@/components/table/hook';
import { PaginationProps } from 'naive-ui/lib';
import { apiSetting } from '@/settings/apiSetting';
import { usePermission } from '@/hooks/business/usePermission'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
export function useFileManager() {

  const categories = ref<TagOption[]>([]);
  const cid = ref();
  const fileUpdRef = ref()
  const files = ref<FileInfo[]>([]);
  const { t } = useI18n()
  const {
    pageField,
    sizeField,
    countField,
    pagesField,
    listField,
  } = apiSetting.table;

  const permission = usePermission()

  const categoryApi = {

    canCreate: permission.hasPermission('files:category:create'),

    menuProps: { show: permission.hasPermission('files:category:edit') },

    fetch: async () => {
      try {
        const result = await fileApi.category()
        categories.value = result
        //默认选中第一个文件分类
        if (result && result.length > 0) {
          cid.value = result[0].value
        }
      } catch (e) {
        return ""
      }
    },

    save: async (tag: TagOption) => {
      try {
        const result = await fileApi.categorySave(tag)
        return result
      } catch (e) {
        return null
      }
    },

    // async function categoryEdit(tag: TagOption) {
    //   try{
    //     const result = await fileApi.categoryCreate(tag)
    //     return result
    //   }catch(e){
    //     return null
    //   }
    // }

    remove: async (v: TagOption, index: number) => {
      try {
        await fileApi.categoryRemove(v.value)
        categories.value.splice(index, 1)
      } catch (e) {
        return null
      }
    },

    change: (tag: TagOption) => {
      cid.value = tag.value
    }

  };

  const { getPagination, setPagination } = usePagination({
    pageSlot: 6, pageSize: 20, showQuickJumper: false, showSizePicker: false,
    'onUpdate:page': (_page: number) => {
      fetchFiles()
    },
    size: 'large'
  }, ref(true), t);

  async function fetchFiles() {
    const { page = 1, pageSize = 20 } = unref(getPagination) as PaginationProps;

    try {
      const result = await fileApi.index({ cid: cid.value, [pageField]: page, [sizeField]: pageSize })
      const data = result[listField] ? result[listField] : [];
      const pagesCount = result[pagesField];
      const totalCount = result[countField];
      //设置pagination
      setPagination({
        pageCount: pagesCount,
        itemCount: totalCount,
      });
      files.value = data
    } catch (e) {
      setPagination({
        page: page == 1 ? 1 : page - 1
      })
    }
  }

  async function refeshFiles() {
    setPagination({ page: 1 });
    fetchFiles()
  }

  async function cusRequest({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) {
    try {
      const res = await fileApi.create({ files: file.file as File, filename: file.name },
        ({ progress }) => {
          onProgress({
            percent: Math.ceil(progress ?? 0)
          })
        })
      console.log("cusRequest", res)
      onFinish()
    } catch (error) {
      onError()
    } finally {
      fileUpdRef.value.clear()
    }
  }


  // 上传前
  // async function onBeforeUpload(file: any, item?: Upload.Item) {
  //   function next() {
  //     const d = {
  //       uid: file.uid,
  //       size: file.size,
  //       name: file.name,
  //       type: getType(file.name),
  //       progress: 0,
  //       url: "",
  //       preload: "",
  //       error: ""
  //     };

  //     // 图片预览地址
  //     if (d.type == "image") {
  //       if (file instanceof File) {
  //         d.preload = window.webkitURL.createObjectURL(file);
  //       }
  //     }

  //     // 上传事件
  //     emit("upload", d, file);

  //     // 赋值
  //     if (item) {
  //       Object.assign(item, d);
  //     } else {
  //       if (props.multiple) {
  //         if (!isAdd.value) {
  //           ElMessage.warning(`最多只能上传${limit}个文件`);
  //           return false;
  //         } else {
  //           list.value.push(d);
  //         }
  //       } else {
  //         list.value = [d];
  //       }
  //     }

  //     return true;
  //   }


  //     if (file.size / 1024 / 1024 >= limitSize) {
  //       ElMessage.error(`上传文件大小不能超过 ${limitSize}MB!`);
  //       return false;
  //     }

  //     return next();
  //   }
  // }

  function onFinish(options: { file: UploadFileInfo, event?: Event }) {

  }


  watch(
    cid,
    (val) => { fetchFiles() }
  )

  categoryApi.fetch()

  return {
    categories,
    categoryApi,
    files,
    fetchFiles,
    getPagination, setPagination,
    refeshFiles,
    cusRequest,
    fileUpdRef,
    onFinish,
  }

} 