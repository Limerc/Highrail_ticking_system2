import { useUserStore } from "@/stores/user"
import { ContentType, req } from "./req"

const noAuth = true
let userStore: ReturnType<typeof useUserStore> | null = null
function getStore() {
  if (userStore)
    return userStore
  return userStore = useUserStore()
}
export interface LoginReq {
  ID_numberOrPhone: string
  password: string
}

export interface RegisterReq {
  username: string
  password: string
  phone: string
  ID_number: string
}

export const register = (data: RegisterReq): Promise<void> =>
  req({ method: 'POST', url: '/user/register', contentType: ContentType.URL, data, noAuth })


/**
 *
 * @param loginReqData
 * @returns jwt token
 */
export const login = (loginReqData: LoginReq): Promise<string> => {
  const { ID_numberOrPhone, password } = loginReqData
  let data: { password: string, phone?: string, ID_number?: string } = { password }
  if (/^\d{11}$/.test(ID_numberOrPhone)) {
    data.phone = ID_numberOrPhone
    return req({ method: 'POST', url: '/user/loginByPhone', data, noAuth })
  } else {
    data.ID_number = ID_numberOrPhone
    return req({ method: 'POST', url: '/user/loginByID', data, noAuth })
  }
}


export interface UserInfo {
  id: number
  username: string
  password: string
  phone: string
  ID_number: string
  Is_admin: number
}

export const getUserInfo = async (explicit = true): Promise<UserInfo> => {
  if (!getStore().getToken())
    return Promise.reject('登录超时')
  const res = await req({ url: '/user/userInfo', showError: explicit, showLoading: false })
  return { ...res, Is_admin: res.isAdmin, ID_number: res.IDNumber, id: res.u_id }
}

export type UpdateUserInfoForm = Pick<UserInfo, 'username' | 'phone' | 'ID_number'>

export const updateUserInfo = (data: UpdateUserInfoForm & { uId: number }): Promise<void> =>
  req({ method: 'PUT', url: '/user/update', data: { ...data, IDNumber: data.ID_number, u_id: data.uId }, contentType: ContentType.JSON })

export interface RePasswordForm {
  old_pwd: string
  new_pwd: string
  re_pwd: string
}

export const rePassword = (data: RePasswordForm): Promise<void> =>
  req({ method: 'PATCH', url: '/user/updatePwd', data, contentType: ContentType.JSON })
