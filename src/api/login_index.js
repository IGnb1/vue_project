import axios from '@/utils/axios.js'

export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
