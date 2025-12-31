/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-11-06 10:13:28
 * @Desc: 
 */
import type { App } from 'vue';
import {
  create,
  NInput,
  NButton,
  NForm,
  NCheckboxGroup,
  NCheckbox,
  NIcon,
  NTooltip,
  NSwitch,
  NDatePicker,
  NSelect,
  NCascader,
  NTreeSelect,
  NRadioGroup,
  NRadio,
  NRadioButton,
  NInputGroup,
  NInputNumber,
  NUpload,
  NTimePicker,
  NTag,
  NDivider,
} from 'naive-ui';

const naive = create({
  components: [
    NInput,
    NButton,
    NForm,
    NCheckboxGroup,
    NCheckbox,
    NIcon,
    NTooltip,
    NSwitch,
    NDatePicker,
    NSelect,
    NCascader,
    NTreeSelect,
    NRadioGroup,
    NRadio,
    NRadioButton,
    NInputGroup,
    NInputNumber,
    NUpload,
    NTimePicker,
    NTag,
    NDivider
  ],
});

export function setupNaive(app: App<Element>) {
  app.use(naive);
}
