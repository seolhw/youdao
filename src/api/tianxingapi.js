// 只管理天行数据的API
import http from './axios'

const URL_DOMAIM = 'http://api.tianapi.com/txapi' // url域名前缀
const API_KEY = 'ede06aa59b66f74bc84140179601a324' // API
export default {
  // 请求每日一句英语
  getEnsentence() {
    return http.get(URL_DOMAIM + '/ensentence/', {
      key:API_KEY
    })
  },
}