import { ProxyOptions } from "vite";

type ProxyList = [string, string][];

type ProxyTargets = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

export function setupProxy(list: ProxyList = []) {
  const proxy: ProxyTargets = {}
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);
    proxy[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return proxy
}