import { useUserStore } from "@/stores/user"
import { logout } from "@/util"
import axios, { type AxiosInstance } from "axios"
import { ElLoading, ElMessage } from "element-plus"

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export enum ContentType {
  FORM = 'multipart/form-data',
  JSON = 'application/json',
  URL = 'application/x-www-form-urlencoded',
  BIN = 'application/octet-stream'
}
export interface RequestOptions {
  url: string
  method?: Method
  params?: any
  contentType?: ContentType
  data?: any
  noAuth?: any
  showLoading?: boolean
  showError?: boolean
}
export const AUTH = 'Authorization'

let loading: ReturnType<typeof ElLoading.service> | null = null
let ins: AxiosInstance | null = null
let userStore: ReturnType<typeof useUserStore> | null = null
function getIns() {
  if (ins)
    return ins
  ins = axios.create({
    baseURL: import.meta.env.PROD ? '' : `/api`,
    timeout: 10000,
  })
  //
  ins.interceptors.request.use(
    config => {
      if (!loading && (config as any).showLoading) {
        loading = ElLoading.service({
          lock: true,
          text: '加载中',
          background: 'rgba(0, 0, 0, 0.5)',
        })
      }
      return config
    },
    err => {
      if (loading) {
        loading.close()
        loading = null
      }
      console.log('请求失败1')
      ElMessage.error('请求失败')
      return Promise.reject(err)
    })
  //
  ins.interceptors.response.use(
    resp => {
      if (loading) {
        loading.close()
        loading = null
      }
      const { data } = resp
      const { responseType } = resp.config
      if (responseType == "arraybuffer" || responseType == "blob") {
        return data
      }
      if (!data.code)
        return data.data
      if ((resp.config as any).showError) {
        ElMessage.error(data.message)
      }
      return Promise.reject(data)
    }, err => {
      if (loading) {
        loading.close()
        loading = null
      }
      if (err.status === 401) {
        if (err.config.showError) {
          ElMessage.error('登录超时')
          getStore().clearLogin()
          logout()
        }
        return Promise.reject('登录超时')
      }
      ElMessage.error('请求失败')
      return Promise.reject(err)
    }
  )
  return ins
}
function getStore() {
  if (userStore)
    return userStore
  return userStore = useUserStore()
}
export function req(url: string, method?: Method): Promise<any>
export function req(config: RequestOptions): Promise<any>
export async function req(configOrUrl: string | RequestOptions, method: Method = 'GET'): Promise<any> {
  let config: RequestOptions = {
    url: '',
    method,
    showLoading: true,
    showError: true
  }
  if (typeof configOrUrl === 'string')
    config = { ...config, url: configOrUrl }
  else
    config = { ...config, ...configOrUrl }
  // 处理content-type
  config.contentType = config.contentType ?? ContentType.URL
  if (config.contentType === ContentType.FORM) {
    const formData = new FormData()
    for (const key in config.data) {
      formData.append(key, config.data[key] ?? '')
    }
    config.data = formData
  }
  // else if (config.contentType === ContentType.URL) {
  //   const params = new URLSearchParams()
  //   for (const key in config.data) {
  //     params.append(key, config.data[key] ?? '')
  //   }
  //   config.params = params
  // }
  // 处理请求头
  const headers: any = {
    'Content-Type': config.contentType,
    'X-Requested-With': 'XMLHttpRequest'
  }
  if (!config.noAuth)
    headers[AUTH] = getStore().getToken()
  const resConfig = { ...config, headers }
  return getIns()(resConfig)
}
