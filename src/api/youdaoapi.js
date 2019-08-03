// 只管理有道的API
import http from './axios'
import { UUID,getInput } from '@/common/common'

const sha256 = require('js-sha256')
const URL_DOMAIM = 'http://localhost:8080' // url域名前缀，wepack进行跨域
const API_ID = '7a65f497b7bd4d86' // 应用ID
const API_KEY = '7EecLcp9gmVe3sfHHP8hW352ktGZAru0' // 应用秘钥
export default {
  // 请求翻译API
  getYoudao(data) {
    const salt = UUID()
    const curtime = Math.round(new Date().getTime()/1000) // 时间戳
    return http.get(URL_DOMAIM+'/api', {
      from: 'auto',
      to: 'auto',
      ...data, // data中必须有q；from,to可有可无
      appKey:API_ID,
      salt:salt,
      sign: sha256(API_ID+getInput(data.q)+salt+curtime+API_KEY),
      ext:'mp3', // 翻译结果
      voice:'0', // 声音0为女声，1为男声
      signType:'v3', // sha256加密类型
      curtime:curtime // 	当前UTC时间戳
    })
  },
}
