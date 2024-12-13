import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AUTH } from '@/apis/req'
import { getUserInfo as apiGetUserInfo, type UserInfo } from '@/apis/user'

const USER_INFO_KEY = 'userInfo'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>()
  const jwtToken = ref('')
  const userUpdateStatus = ref(false) // 用户信息是否更新

  function triggerUserUpdateStatus() {
    userUpdateStatus.value = !userUpdateStatus.value
  }

  function getUserUpdateStatus() {
    return userUpdateStatus.value
  }

  async function setToken(token: string) {
    localStorage.setItem(AUTH, jwtToken.value = token)
    await requestAndSetUserInfo(true)
  }

  function getToken() {
    if (jwtToken.value)
      return jwtToken.value
    else
      return jwtToken.value = (localStorage.getItem(AUTH) ?? '')
  }

  async function requestAndSetUserInfo(force: boolean) {
    if (force) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value = await apiGetUserInfo()))
      return
    }
    if (user.value)
      return
    const storageInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY)!) as UserInfo
    if (storageInfo) {
      user.value = storageInfo
      return
    }
    try {
      user.value = await apiGetUserInfo(false)
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    } catch (e) {
      console.error(`获取用户信息失败: ${e}`)
    }
  }


  async function getUserInfo(force = false) {
    await requestAndSetUserInfo(force)
    return user.value
  }

  function clearLogin() {
    localStorage.removeItem(AUTH)
    localStorage.removeItem(USER_INFO_KEY)
    jwtToken.value = ''
    user.value = void 0
  }

  return {
    setToken,
    getToken,
    getUserInfo,
    triggerUserUpdateStatus,
    getUserUpdateStatus,
    clearLogin
  }
})
