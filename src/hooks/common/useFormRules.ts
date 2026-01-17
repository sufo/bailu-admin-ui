
import { Ref } from 'vue'
import { FormItemRule } from "naive-ui";
import { i18n } from '@/locales/i18n';
import { userIsExist } from '@/api/admin';
import { REGEXP_PHONE, REGEXP_PHONE_INTEl, REGEXP_PWD, REGEXP_EMAIL, REGEXP_CODE_SIX } from '@/constants/consts'

const t = i18n.global.t


const createRequired = (message = t('tips.notEmpty'), trigger = ['input']): FormItemRule => ({ required: true, message, trigger });


//export const requiredFormRule = createRequired();


/**表单规则 */
interface CustomFormRules {
  phone: FormItemRule[];

  pwd: FormItemRule[];

  smsCode: FormItemRule[];

  email: FormItemRule[];

  captcha: FormItemRule[];

  captchaNumber: FormItemRule[];
  [x: string]: FormItemRule[]
}


/**表单规则 */
const rules: CustomFormRules = {
  phone: [
    createRequired(t('login.mobilePlaceholder')),
    { pattern: REGEXP_PHONE, message: t('login.phoneFormatErr'), trigger: 'change' },
  ],

  pwd: [
    createRequired(t('login.passwordPlaceholder')),
    { pattern: REGEXP_PWD, message: t('login.pwdFormatTip', { min: 6, max: 18, n: 2 }), trigger: ['input', 'blur'] }
  ],

  smsCode: [
    createRequired(t('login.smsPlaceholder')),
    { pattern: REGEXP_CODE_SIX, message: t('login.smsCodeFormatErr', { n: 6 }), trigger: 'input' }
  ],
  captcha: [
    createRequired(t('login.captcha')),
    // { pattern: /^\d+$/, message: t('login.captchaErr'), trigger: 'input' }
  ],
  email: [
    { pattern: REGEXP_EMAIL, message: t('login.emailFormatErr'), trigger: 'blur' }
  ],

  captchaNumber: [
    createRequired(t('login.captcha')),
    { pattern: /^(\-|\+)?\d+$/, message: t('login.requireNumberErr'), trigger: 'input' }
  ]

}

/** 是否为空字符串 */
function isBlankString(str: string) {
  return str.trim() === '';
}

function phoneExt(dialCode: Ref<String>): FormItemRule[] {
  const phoneExtRule: FormItemRule[] = [
    { required: true, message: t('login.mobilePlaceholder'), trigger: ['input', 'blur'] },
    {
      validator: (rule, value) => {
        //表示没有输入
        if (!value || value.startsWith("+" + dialCode) && value.length == dialCode.value.length + 1) {
          return new Error(t('login.mobilePlaceholder'));
        }

        let phone = value
        let reg = REGEXP_PHONE_INTEl
        if (dialCode.value === '86') {
          reg = REGEXP_PHONE
          //去掉地区码和空格
          if (value.startsWith("+" + dialCode)) //表示存在dialCode
            phone = value.substring(dialCode.value.length + 1)
          phone = value.replace(/\s*/g, "")
        }
        //验证
        // if (!reg.test(phone))
        //   return Promise.reject(rule.message);
        // return Promise.resolve()
        return reg.test(phone)
      },
      message: t('login.phoneFormatErr'),
      trigger: 'input'
    }
  ]
  return phoneExtRule
}

//国际手机号校验
function phoneExtValidator(phone: string, dialCode: Ref<string> = ref('86')): Error | null {
  if (!phone || phone.startsWith("+" + dialCode)
    && phone.length == dialCode.value.length + 1) {
    return new Error(t('login.mobilePlaceholder'));
  }
  let v = phone
  let reg = REGEXP_PHONE_INTEl
  debugger
  //如果是国内号码
  if (dialCode.value === '86') {
    reg = REGEXP_PHONE
    //去掉地区码和空格
    if (v.startsWith("+" + dialCode.value)) //表示存在dialCode
      v = phone.substring(dialCode.value.length + 1)
    phone = v.replace(/\s*/g, "")
  }
  //校验
  if (reg.test(phone)) {
    return null
  } else {
    return new Error(t('login.phoneFormatErr'))
  }
}

/**
 * 是否被占用
 */
function isExist(name: string): FormItemRule {
  return {
    validator: (rule, value) => {
      if (value) {
        return new Promise<void>(async (resolve, reject) => {
          const res = await userIsExist(name, value)
          if (res) reject(t('tips.isExist', { v: value }))
          else resolve()
        })
      }
    },
    trigger: ['blur']
  }
}


/** 确认密码的表单规则 */
function confirmPwdRule(pwd: Ref<string>): FormItemRule[] {
  const confirmPwdRule: FormItemRule[] = [
    { required: true, message: t('login.passwordPlaceholder'), trigger: ['input'] },
    {
      validator: (rule, value) => {
        // if (!isBlankString(value) && value !== pwd.value)
        //   return Promise.reject(rule.message);
        // return Promise.resolve()
        // return (!!value && !isBlankString(value) && value == pwd.value)
        return value == pwd.value
      },
      message: t('login.diffPwd'),
      trigger: ['input']
    }
  ]
  return confirmPwdRule
}


/** 获取图片验证码的表单规则 */
function captchaRule(imgCode: Ref<string>): FormItemRule[] {
  const imgCodeRule: FormItemRule[] = [
    { required: true, message: t('tips.notEmpty') },
    {
      validator: (rule, value) => {
        if (!isBlankString(value) && value !== imgCode.value) {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      message: t('login.captchaErr'),
      trigger: 'blur'
    }
  ];
  return imgCodeRule;
}



//业务相关的手机校验类型
interface PhoneRules {
  isEmpty: (phone: string) => string
  isWellFormated: (dialCode: Ref<string>, phone: string) => string
  isExist: (dialCode: Ref<string>, phone: string) => Promise<string>
}
//业务相关的手机校验
const phoneValidator: PhoneRules = {
  isEmpty: phone => {
    return !phone ? t('login.mobilePlaceholder') : ''
  },
  isWellFormated: (dialCode, phone) => {
    phone = phone.replace(/\s*/g, "")
    if (!phone) return t('login.mobilePlaceholder')
    const err = phoneExtValidator(phone, dialCode)
    return err ? err.message : ''
  },
  isExist: async (dialCode, phone) => {
    const res = await userIsExist("phone", dialCode.value, phone);
    if (res) {
      return t('tips.isExist', { v: phone });
    } else return ''
  }

}

export default function useFormRule() {
  return {
    createRequired,
    ...rules,
    isExist,
    confirmPwdRule,
    captchaRule,
    phoneExt,
    phoneExtValidator,
    phoneValidator
  }
}


