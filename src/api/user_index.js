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

// 分配用户角色
export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

// 删除单个用户
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 修改用户状态
export const changestate = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
