import axios from '@/utils/axios.js'

// 获取所有权限列表
export const getAllRight = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
