import axios from '@/utils/axios.js'

// 获取所有权限列表
export const getAllRight = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 左侧菜单权限
export const getRightMenu = () => {
  return axios({
    url: 'menus'
  })
}
