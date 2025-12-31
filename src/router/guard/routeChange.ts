import mitt from "@/utils/mitt/mitt";
import { getRawRoute } from "@/utils/util";
import { RouteLocationNormalized} from "vue-router";


const emitter = mitt();

const key = Symbol();

let lastChangeTab: RouteLocationNormalized;

export function setRouteChange(lastChangeRoute: RouteLocationNormalized){
  const r = getRawRoute(lastChangeRoute)
  emitter.emit(key,r)
  lastChangeTab = r
}

export function listenerRouteChange(
  callback: (route?: RouteLocationNormalized) => void,
  immediate = true
){
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab)
}

export function removeTabChangeEventListener(){
  emitter.clear()
}