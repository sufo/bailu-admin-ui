import { msgApi } from '@/api/admin'

export interface MsgList<T = Recordable> {
  unread: number,
  data: T[]
}

export interface MsgState {
  notices: MsgList<Notice>;  //通知公告
  reminds: MsgList<EventRemind>;
  chat: MsgList<Chat>;
}


export const useMessageStore = defineStore("message-store", {
  state: (): MsgState => ({
    notices: { unread: 0, data: [] },
    reminds: { unread: 0, data: [] },
    chat: { unread: 0, data: [] },
  }),
  getters: {
    getNotices: state => state.notices,
    getReminds: state => state.reminds,
    getChat: state => state.chat,
    unread: state => state.notices.unread + state.reminds.unread + state.chat.unread  //未读总数
  },
  actions: {
    setNotice(payload: MsgList<Notice>) {
      this.notices = payload
    },
    setNoticeData(data: Notice[]) {
      this.notices.data = data || []
    },
    setRemind(payload: MsgList<EventRemind>) {
      this.reminds = payload
    },
    setChat(payload: MsgList<Chat>) {
      this.chat = payload
    },

    loadUnread() {
      try {
        const res = msgApi.unreadCount('all')
        console.log("res", res)
      } catch (e) {
        Promise.reject(e)
      }
    },

    async loadData(pageIndex: number, pageSize = 10) {
      try {
        const res = await msgApi.unreadList({ pageIndex, pageSize })
        console.log("res", res)

      } catch (e) {
        Promise.reject(e)
      }
    }

  }

})