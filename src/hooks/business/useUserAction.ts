import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useAsyncRouteStore } from '@/store/modules/route';
import { i18n } from '@/locales/i18n';
import { Page } from '@/constants/enum';
import { router as routerInstance } from '@/router';


export function useUserAction() {
    const router = useRouter() || routerInstance;
    const userStore = useUserStore();
    const asyncRouteStore = useAsyncRouteStore();

    async function afterLogin() {
        // 登录成功弹出欢迎提示
        window.$notification?.success({
            title: i18n.global.t('login.loginSuccessTitle'),
            content: `${i18n.global.t('login.loginSuccessDesc')}，${userStore.getUserInfo?.username}!`,
            duration: 3000
        });

        let path = userStore.getUserInfo?.homePath || Page.BASE_HOME;
        const { query } = router.currentRoute.value;
        if (query?.redirect) {
            path = (query.redirect as string);
        }

        // 初始化路由，传入router实例
        await asyncRouteStore.initRoute(router, userStore.getUserInfo?.homePath || Page.BASE_HOME);
        await router.replace(path);
    }

    async function login(params: LoginParams) {
        await userStore.doLogin(params);
        await afterLogin();
    }

    async function smsLogin(phone: string, smsCode: string) {
        await userStore.smsLogin(phone, smsCode);
        await afterLogin();
    }

    async function logout(toLogin = false) {
        // 调用store的logout清理状态 (不包含跳转)
        await userStore.logout();

        if (toLogin) {
            router.replace(Page.BASE_LOGIN);
        }
    }

    return {
        login,
        logout,
        smsLogin,
        afterLogin
    };
}
