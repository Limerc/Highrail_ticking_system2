<script setup lang="ts">
  import { login, register, type LoginReq, type RegisterReq } from '@/apis/user';
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
  import { Cellphone, Key, Postcard, User } from '@element-plus/icons-vue'
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';
  const userStore = useUserStore()
  const router = useRouter()
  //表单基础逻辑
  type RegisterForm = RegisterReq & { confirmPassword: string }
  type LoginForm = LoginReq
  const registerFormRef = ref<FormInstance>()
  const loginFormRef = ref<FormInstance>()
  const loginFormVal = ref<LoginForm>({
    ID_numberOrPhone: '',
    password: ''
  })
  const registerFormVal = ref<RegisterForm>({
    phone: '',
    ID_number: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const registerRules = ref<FormRules<RegisterForm>>({
    phone: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^\d{11}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
    ],
    ID_number: [
      { required: true, message: '请输入身份证号码', trigger: 'blur' },
      { pattern: /^[0-9xX]{18}$/, message: '请输入正确的身份证号码', trigger: ['blur', 'change'] }
    ],
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 10, message: '用户名长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 3, message: '密码长度应大于3个字符', trigger: ['blur', 'change'] }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator(_, value, cb) {
          if (value !== registerFormVal.value.password)
            cb(new Error('两次输入的密码不一致'))
          else
            cb()
        }
      }
    ]
  })
  const loginRules = ref<FormRules<LoginForm>>({
    ID_numberOrPhone: [
      { required: true, message: '请输入手机号码或证件号码', trigger: 'blur' },
      { pattern: /^(\d{11}|[0-9xX]{18})$/, message: '请输入正确的手机号码或证件号码', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 3, message: '密码长度应大于3个字符', trigger: ['blur', 'change'] }
    ]
  })
  const registerMode = ref(false)
  function submit() {
    (registerMode.value ?
      registerFormRef : loginFormRef).value?.validate(async valid => {
        if (!valid)
          return
        if (registerMode.value) {
          await register(registerFormVal.value)
          ElMessage.success('注册成功')
          registerMode.value = false
        } else {
          const jwtToken = await login(loginFormVal.value)
          userStore.setToken(jwtToken)
          ElMessage.success('登录成功')
          router.push({ name: 'main' })
        }
      })
  }
</script>

<template>
  <div class="mid">
    <img class="logo" @click="router.push({ name: 'main' })" src="https://www.12306.cn/index/images/logo@2x.png"
      alt="12306-logo">
    <ElForm v-if="registerMode" @submit.prevent="submit" ref="registerFormRef" :model="registerFormVal"
      :rules="registerRules">
      <ElFormItem prop="username">
        <ElInput size="large" placeholder="用户名" v-model.trim="registerFormVal.username" :prefix-icon="User" />
      </ElFormItem>
      <ElFormItem prop="password">
        <ElInput size="large" placeholder="密码" v-model.trim="registerFormVal.password" show-password type="password"
          :prefix-icon="Key" />
      </ElFormItem>
      <ElFormItem prop="confirmPassword">
        <ElInput size="large" placeholder="请重复密码" v-model.trim="registerFormVal.confirmPassword" show-password
          type="password" :prefix-icon="Key" />
      </ElFormItem>
      <ElFormItem prop="phone">
        <ElInput size="large" placeholder="手机号" v-model.trim="registerFormVal.phone" :prefix-icon="Cellphone" />
      </ElFormItem>
      <ElFormItem prop="ID_number">
        <ElInput size="large" placeholder="证件号" v-model.trim="registerFormVal.ID_number" :prefix-icon="Postcard" />
      </ElFormItem>
      <ElFormItem>
        <ElButton class="operate-btn" type="primary" native-type="submit">
          注册
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElForm v-else @submit.prevent="submit" ref="loginFormRef" :model="loginFormVal" :rules="loginRules">
      <ElFormItem prop="ID_numberOrPhone">
        <ElInput size="large" placeholder="手机号/证件号" v-model.trim="loginFormVal.ID_numberOrPhone"
          :prefix-icon="Postcard" />
      </ElFormItem>
      <ElFormItem prop="password">
        <ElInput size="large" placeholder="密码" v-model.trim="loginFormVal.password" show-password type="password"
          :prefix-icon="Key" />
      </ElFormItem>
      <ElFormItem>
        <ElButton class="operate-btn" type="primary" native-type="submit">
          登录
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElLink type="primary" @click="registerMode = !registerMode">{{
      registerMode ? '已有账号，去登录' :
        '没有账号，去注册' }}
    </ElLink>
  </div>
</template>

<style lang="less" scoped>
  .mid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);
    padding: 20px 60px;

    .logo {
      display: block;
      margin: 20px auto;
      cursor: pointer;
      width: 200px;
    }

    .operate-btn {
      margin-top: 10px;
      width: 100%;
    }
  }
</style>
