import axios from '@/utils/axios.js'

// 获取商品列表
export const getCategories = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
