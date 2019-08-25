import axios from '@/utils/axios.js'

export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
