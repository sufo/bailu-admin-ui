declare interface Base {
  status: boolean;
  createdAt: string;
}

declare interface UserInfo {
  id: string | number;
  nickName?: string;
  username: string;
  realName: string;
  avatar: string;
  sex?: number;
  phone?: string;
  email?: string;
  profile?: string; //介绍
  homePath?: string;
  deptName?: string
  roles: OptionWithKey<string>[];
  posts: OptionWithKey<string>[];
  permissions: string[]; //权限列表
}

declare interface UserState {
  /** 用户信息 */
  userInfo: Nullable<UserInfo>;
  /** 用户token */
  token?: string;

  // refreshToken?: string,

  //token过期时长  秒
  expires: number,

  // roleList: UserRole[];
  lastUpdTime: number;
}


declare interface RoleInfo {
  roleName: string;
  value: string;
}
declare interface ResetParams {
  dialCode: string,
  phone: string;
  smsCode: string;
  password: string
}

declare interface RegisteParams extends ResetParams {
  username: string;
}

declare interface LoginParams {
  username: string
  password: string // 密码(rsa加密)
  captchaId: string // 验证码ID
  imgCode: string // 验证码
}


//menu
declare interface MetaVo {
  icon?: string;
  query?: string;
  keepAlive?: boolean;
  isFrame?: boolean;
  hide?: boolean;
  permission?: string;
}

//menu绑定api
declare interface MenuApi {
  menuId: number
  method: string  //api请求方法
  path: string    //api路径
}

// interface MenuVo extends MetaVo{ //报错 [@vue/compiler-sfc] Unresolvable type reference or unsupported built-in utility type
declare interface MenuVo {
  id: number;
  pid: number | undefined;
  name: string;
  i18nKey?: string;
  path: string;
  component?: string;
  type?: string; //M目录 C菜单 F按钮
  children?: MenuVo[];
  sort: number;
  status: number;
  icon?: string;
  query?: string;
  keepAlive?: boolean;
  isFrame?: boolean;
  hide?: boolean;
  permission?: string;
  createdAt: string;
  apis?: MenuApi[];
}

declare interface Dept {
  id: string | number;
  pid: string | number;
  name: string;
  leader?: string;
  phone?: string;
  email?: string;
  sort: number;
  status: number;
  createdAt: string;
  children?: Dept[];
}
declare interface Role {
  id: string | number;
  name: string;
  roleKey?: string;
  dataScope?: string;
  menuCheckStrictly: boolean;
  deptCheckStrictly: boolean;
  email?: string;
  sort: number;
  status: number;
  remark: string;
  createdAt: string;
  loading?: boolean
}

declare interface User {
  id: string | number;
  username: string;
  password: string;
  nickName?: string;
  profile?: string;
  email?: string;
  DialCode?: string;
  phone: string;
  sex: number;
  // dept?: Recordable;
  roles?: Array<Recordable>;
  posts?: Array<Recordable>;
  status: number;
  remark?: string;
  createdAt: string;
  loading?: boolean;
  popShow?: boolean; //popConfirm show
  deptId?: number;
  roleIds?: Array<number>;
  postIds?: Array<number>;
}

declare interface Post {
  id: string | number;
  name: string;
  postCode?: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  loading?: boolean;
}

declare interface SelectOption {
  key: string | number;
  value: string;
  children: Array<SelectOption>
}


declare interface Dict {
  id: string | number;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  loading?: boolean;
}

declare interface DictItem {
  id: string | number;
  label: string;
  value: string;
  code: string;
  remark?: string;
  isDefault?: boolean;
  fixed?: boolean;  //是否固定，固定不可修改
  sort?: number;
  status: number;
  createdAt: string;
  loading?: boolean;
}

//操作日志
declare interface Operation {
  id: string | number;
  ip: string;
  location: string;
  method: string;
  path: string;
  status?: number;
  respCode?: number;
  latency: number;
  agent: string;
  os: string;
  browser: string;
  msg: string;
  body: string; //请求体
  resp: string; //响应
  operName?: string
  createdAt: string;
  loading?: boolean;
}

//登录日志
declare interface LoginLog {
  id: string | number;
  username: string;
  ip: string;
  addr: string;
  browser: string;
  loginTime: string;
  status: number | string;
  msg: string;
}

declare interface OnlineUser {
  id: string | number;
  username: string;
  ip: string;
  addr: string;
  browser: string;
  os: string;
  deptName: string;
  loginTime: string;
}

declare interface Notice {
  id: string | number;
  title: string;
  content: string;
  readFlag: number | string;
  type: number;  //1通知，2公告(公告只能全体)
  sendScope: string;
  sendStatus: string;  //0未发布，1已发布，2已撤销
  sender: string; //发布人名字
  senderId: number | string;
  receivers?: string;  //接受对象唯一标识符，多个用逗号分割
  receiverArr?: Array<string | number>;  //临时保存所选项
  notifyChannel: string;
  startTime?: string;
  endTime?: string;
  readTime?: string;
  cancelTime?: string;
  scheduledTime?: string; //定时发布时间
  createdAt: string;
  loading?: boolean;
}


declare interface Task {
  id: string | number;
  name: string;
  group?: string;
  protocol: string;  //执行方式(FUNC:函数， HTTP SHELL)
  cronExpression: string;
  invokeTarget: string; //调用目标
  args: string; //参数
  httpMethod?: string;
  concurrent: number;  //是否并发执行（1允许 2禁止）
  status: number;
  entryId?: string;
  notifyStrategy?: number   //1:不通知 2:失败通知 3:结束通知 4:结果关键字匹配通知;
  notifyType?: number  //通知类型
  notifyReceiverEmail?: string;
  notifyKeyword?: string;
  remark?: string;
  lastExecTime?: string;  //上一次执行时间
  nextTime?: string; //下一次执行时间
  loading?: boolean;
  [x: string]: string | number
}

declare interface TaskLog {
  id: string | number;
  taskId: string | number;
  taskName: string;
  invokeTarget: string;
  status: number; // 1:执行中  2:执行完毕 3:执行失败 4:任务取消(上次任务未执行完成) 5:异步执行）
  startTime: string;
  stopTime: string;
  totalTime: number;
  result: string; //执行结果输出信息
  exceptInfo: string; //（异常信息）
  loading?: boolean
}


declare interface Cpu {
  cores: number;
  cpus: number[];
}
declare interface ServInfo {
  name: string;
  os: string;
  ip: string;
  arch: string;
}
declare interface Ram {
  used: string;
  total: string;
  free: string;
  usage: number;
}
declare interface Disk extends Ram {
  path: string;
  fsType: string;
}
declare interface Runtime {
  startTime: string;
  runTime: string;
  goos: string;
  numCpu: string;
  compiler: string;
  goVersion: string;
  numGoroutine: number
}

declare interface ServerInfo {
  cpu: Cpu;
  ram: Ram;
  disk: Disk;
  servInfo: ServInfo;
  runtime: Runtime
}

//事件提醒
declare interface EventRemind {
  id: string | number;
  action: string; //动作类型（ 1、点赞 2、评论 3、回复 4、@  5、收藏 6、关注'等）见字典"`
  sourceId: number;  //事件源id 如评论id,回复id，文章id等
  sourceType: string; //目标类型（文章、回复、评论等）
  url: string //源地址
  status: number  //阅读状态
  senderId: number  //操作者的 ID
  receiveId: number  //接受通知的用户
  readTime: string;
  createdAt: string;
}


//私信
declare interface Chat {
  id: string | number;
  content: string;
  status: number //0未读，1已读, 2发送方删除 3接收方删除 4都删除
  senderId: number  //操作者的 ID
  receiveId: number  //接受通知的用户
  sendTime: string;
}

declare interface Message {
  id: number | string;
  /** 消息icon */
  icon: string;
  /** 头像 */
  avatar: string;
  /** 消息标题 */
  title: string;
  /** 消息内容 */
  content: string;
  /** 消息发送时间 */
  date: string;
  /** 消息是否已读 */
  isRead: boolean;
  /** chat 接受方id */
  toId: number; //chat
  //** chat 接收方名字 */
  toName: string;
  /** 标签props */
  tagProps?: import('naive-ui').TagProps;
}

declare interface FileInfo {
  id: number | string;
  url: string;
  classifyId: number | string;
  name: string;
  size: number | string;
  originName: string; //原始文件名
  mime: string;
  tags: string;
}

declare interface FileCategory {
  value: number | string;
  label: string;
}