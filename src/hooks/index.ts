
import useFormRule from './common/useFormRules'
import useCaptcha from './business/useCaptcha'
import { useGo, useRouterPush } from './common/usePage'
import useSMSCode from './business/useSMSCode'
import useCountDown from './business/useCountDown'
import useBoolean from './common/useBoolean'
import useLoading from './common/useLoading'
import { useDesign } from './common/useDesign'
import { useRefs } from './common/useRefs'
import useSortable from './business/useSortable'
import { useMenuSearch } from './business/useMenuSearch'
import { useTabSetting } from './setting/useTabSetting'
import { useGlobalEvents } from './event/window'
import useDragX from './event/drag'
import { useTime } from './common/useTime'
import { useBattery } from './common/useBattery'
import { usePermission } from './business/usePermission'
import { useDarkStyle } from './common/useDarkStyle'
export {
  useDesign, useDarkStyle,
  useFormRule, useCaptcha, useGo, useRouterPush,
  useSMSCode, useCountDown, useBoolean, useLoading,
  useSortable, useMenuSearch, useRefs,
  useGlobalEvents, useDragX, useTime, useBattery,
  useTabSetting, usePermission
};