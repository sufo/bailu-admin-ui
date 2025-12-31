import { i18n} from "@/locales/i18n";
import {NButton} from 'naive-ui';
import { Icon } from "@/components/icon";
import { usePreferenceStore } from "@/store/modules";
// interface Props {
//   // 轮训时间，分钟
//   checkUpdateInterval?: number;
//   // 检查更新的地址
//   checkUpdateUrl?: string;
// }

export function useCheckUpdateNotify(){

  const preference = usePreferenceStore();
  if(!preference.app.enableCheckUpdate) return;
  const checkUpdateUrl = import.meta.env.BASE_URL || '/';
  const t = i18n.global.t
  
  let isChecking = false;
  const curVersionTag = ref('');
  const lastVersionTag = ref('');
  const timer = ref<ReturnType<typeof setInterval>>();
  
  async function getVersionTag() {
    try {
      if (
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1'
      ) {
        return null;
      }
      const response = await fetch(checkUpdateUrl, {
        cache: 'no-cache',
        method: 'HEAD',
      });
  
      return (
        response.headers.get('etag') || response.headers.get('last-modified')
      );
    } catch {
      console.error('Failed to fetch version tag');
      return null;
    }
  }
  
  async function checkForUpdate() {
    const versionTag = await getVersionTag();
    if (!versionTag) {
      return;
    }
    // 首次运行时不提示更新
    if (!lastVersionTag.value) {
      lastVersionTag.value = versionTag;
      return;
    }
  
    if (lastVersionTag.value !== versionTag && versionTag) {
      clearInterval(timer.value);
      curVersionTag.value = versionTag
      handleNotice();
    }
  }

  function handleNotice(){
    const n = window.$notification?.create({
      title: t('tips.checkUpdateTitle'),
      content: t('tips.checkUpdateDesc'),
      avatar: () =>
        h(Icon, {
          size: '16px',
          icon: 'mdi:info',
          style:{color:'var(--info-color)'},
      }),
      action() {
        return h('div', { style: { display: 'flex', justifyContent: 'end', gap: '12px' } }, [
          h(
            NButton,
            {
              onClick() {
                n?.destroy();
              }
            },
            () => t('button.cancelText')
          ),
          h(
            NButton,
            {
              type: 'primary',
              onClick() {
                lastVersionTag.value = curVersionTag.value;
                location.reload();
              }
            },
            () => t('common.refresh')
          )
        ]);
      },
    });

  }
  
  // function onPositive(){
  //   lastVersionTag.value = curVersionTag.value;
  //   location.reload();
  // }
  
  function handleVisibilitychange() {
    if (document.hidden) {
      stop();
    } else {
      if (!isChecking) {
        isChecking = true;
        checkForUpdate().finally(() => {
          isChecking = false;
          start();
        });
      }
    }
  }
  
  //启动定时更新检查
  function start() {
    if (preference.app.checkUpdateInterval <= 0) {
      return;
    }
    // 每 checkUpdateInterval(默认值为1) 分钟检查一次
    timer.value = setInterval(
      checkForUpdate,
      preference.app.checkUpdateInterval * 60 * 1000,
    );
  }
  
  function stop() {
    clearInterval(timer.value);
  }
  
  onMounted(() => {
    start();
    document.addEventListener('visibilitychange', handleVisibilitychange);
  });
  
  onUnmounted(() => {
    stop();
    document.removeEventListener('visibilitychange', handleVisibilitychange);
  });
}