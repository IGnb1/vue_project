import axios from '@/utils/axios.js'

// 获取角色列表
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色指定权限
export const delRightById = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 添加角色
export const addrole = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 角色授权
export const grantRightById = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids: rids }
  })
}

// 编辑角色
export const editRoleById = (data) => {
  return axios({
    url: `roles/${data.id}`,
    method: 'put',
    data
  })
}

// 删除角色
export const delRoleById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
