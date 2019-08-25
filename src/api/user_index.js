import axios from '@/utils/axios.js'

export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 编辑用户信息
export const edituser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 添加用户
export const add = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
