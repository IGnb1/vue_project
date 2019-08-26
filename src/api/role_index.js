import axios from '@/utils/axios.js'

// 获取角色列表
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
