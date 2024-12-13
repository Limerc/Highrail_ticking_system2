<script setup lang="ts">
  import { rePassword, type RePasswordForm } from '@/apis/user';
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
  import { ref } from 'vue';


  const formRef = ref<FormInstance>()
  const formVal = ref<RePasswordForm>({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  })

  const commonPasswordRule = [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, message: '密码长度应大于3个字符', trigger: ['blur', 'change'] }
  ]

  const rules = ref<FormRules<RePasswordForm>>({
    old_pwd: commonPasswordRule,
    new_pwd: commonPasswordRule,
    re_pwd: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator(_, value, cb) {
          if (value !== formVal.value.new_pwd)
            cb(new Error('两次输入的密码不一致'))
          else
            cb()
        }
      }
    ]
  })

  function submit() {
    formRef.value?.validate(async valid => {
      if (!valid)
        return
      await rePassword(formVal.value)
      ElMessage.success('修改成功！')
      formVal.value.new_pwd = formVal.value.re_pwd = formVal.value.old_pwd = ''
    })
  }
</script>

<template>
  <div class="my-repwd-container">
    <ElForm @submit.prevent="submit" ref="formRef" label-width="auto" :model="formVal" :rules>
      <ElFormItem label="旧密码" prop="old_pwd">
        <ElInput size="large" v-model.trim="formVal.old_pwd" type="password" show-password />
      </ElFormItem>
      <ElFormItem label="新密码" prop="new_pwd">
        <ElInput size="large" v-model.trim="formVal.new_pwd" type="password" show-password />
      </ElFormItem>
      <ElFormItem label="重复新密码" prop="re_pwd">
        <ElInput size="large" v-model.trim="formVal.re_pwd" type="password" show-password />
      </ElFormItem>
      <ElFormItem label=" ">
        <ElButton type="primary" native-type="submit">保存</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
  .my-repwd-container {
    width: 100%;
    height: 100%;
    padding: 20vh 20vw;
  }
</style>
