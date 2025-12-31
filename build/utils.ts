export function isDev(mode: string): boolean {
  return mode === 'development'
}

export function isProd(mode: string): boolean {
  return mode === 'production'
}

//处理环境变量并放到process.env
export function modifyEnv(envConf: Recordable): ImportMetaEnv {
  const env: any = {}
  for (const key of Object.keys(envConf)) {
    let val = envConf[key].replace(/\\n/, '\n')
    val = val === 'true' ? true : val === 'false' ? false : val
    if (key === 'VITE_PORT') {
      val = Number(val)
    }
    if (key === 'VITE_PROXY' && val) {
      try {
        val = JSON.parse(val.replace(/'/g, '"'))
      } catch (error) {
        val = ''
      }
    }

    env[key] = val
    if (typeof val === 'string') {
      process.env[key] = val
    }
    else if (typeof val === 'object') {
      process.env[key] = JSON.stringify(val)
    }
  }
  return env
}
