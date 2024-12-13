<script setup lang="ts">
  import { updateUserInfo, type UpdateUserInfoForm, type UserInfo } from '@/apis/user';
  import { useUserStore } from '@/stores/user';
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
  import { ref } from 'vue';
  const userStore = useUserStore();
  const formRef = ref<FormInstance>();
  const formVal = ref<UpdateUserInfoForm>({
    username: '',
    phone: '',
    ID_number: ''
  })
  const rules = ref<FormRules<UpdateUserInfoForm>>({
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
  })
  async function init() {
    const { phone, username, ID_number } = (await userStore.getUserInfo(true))!
    formVal.value = { phone, username, ID_number }
  }
  init()
  const readonly = ref(true)

  function submit() {
    formRef.value?.validate(async valid => {
      if (!valid)
        return
      await updateUserInfo({ ...formVal.value, uId: (await userStore.getUserInfo())?.id! })
      ElMessage.success('修改成功！正在刷新...')
      readonly.value = true
      userStore.triggerUserUpdateStatus()
      init()
    })
  }
</script>

<template>
  <div class="my-info-container">
    <ElForm @submit.prevent="submit" ref="formRef" label-width="auto" :model="formVal" :rules>
      <ElFormItem :required="false" label="用户名" prop="username">
        <ElInput size="large" :readonly v-model.trim="formVal.username" />
      </ElFormItem>
      <ElFormItem :required="false" label="手机号" prop="phone">
        <ElInput size="large" :readonly v-model.trim="formVal.phone" />
      </ElFormItem>
      <ElFormItem :required="false" label="证件号" prop="ID_number">
        <ElInput size="large" :readonly v-model.trim="formVal.ID_number" />
      </ElFormItem>
      <ElFormItem label=" ">
        <ElButton v-if="readonly" type="primary" @click="readonly = false">编辑</ElButton>
        <template v-else>
          <ElButton type="success" native-type="submit">保存</ElButton>
          <span style="color: #aaa;font-size: 12px;margin-left: 10px;">请在上方修改对应信息</span>
        </template>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
  .my-info-container {
    width: 100%;
    height: 100%;
    padding: 20vh 20vw;
  }
</style>
