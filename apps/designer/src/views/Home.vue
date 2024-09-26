<script setup lang="ts">
import { ref } from 'vue'
import { Post } from '@ruomu-ui/designer'
import { useRouter } from 'vue-router'
import {NCard, NForm, NFormItem, NInput, NButton} from 'naive-ui'

const username = ref('')
const password = ref('')
const router = useRouter()
const login = async () => {
  try {
    const resp = await Post('/user/login', {
      username: username.value,
      password: password.value
    })
    if (resp.code === 0 && resp.data) {
      const token = resp.data.token
      sessionStorage.setItem('token', token)
      
      router.push('/designer')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <n-card title="登录一下" style="width: 600px;">
      <n-form>
        <n-form-item label="用户名">
          <n-input v-model:value="username" />
        </n-form-item>
        <n-form-item label="密码">
          <n-input v-model:value="password" type="password" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button type="primary" @click="login">登录</n-button>
      </template>
    </n-card>
    
  </div>
</template>

<style scoped>

</style>