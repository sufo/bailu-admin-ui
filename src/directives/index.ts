
import type {App} from 'vue'
import setupNetworkDirective from './network'
import setupPermissionDirective from './permission';
import setWatermarkDirective from './watermark';
import setClickOutsideDirective from './click-outside';
export function setupDirectives(app:App<Element>){
  setupNetworkDirective(app);
  setupPermissionDirective(app);
  setWatermarkDirective(app);
  setClickOutsideDirective(app);
}