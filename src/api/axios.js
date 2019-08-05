import axios from 'axios'
const qs = require('qs')
async function get(url, data={}) {
  data = {
    ...data,
  }
  let config = {
    params: data
  }
  let p = await axios.get(url, config)
  return new Promise((resolve, reject) => {
    p && p.status == 200 ? resolve(p.data) : reject(p)
  })
}
async function post(url, data={}) {
  data = {
    ...data,
  }
  for(let key in data){
    if(data[key]===null || data[key]===undefined){
      delete data[key]
    }
  }
  let config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  let p = await axios.post(url, qs.stringify(data), config)
  return new Promise((resolve, reject) => {
    p && p.status == 200 ? resolve(p.data) : reject(p)
  })
}
async function postFile(url, data){ // 文件上传
  let formdata = new FormData()
  data = {
    ...data,
  }
  for(let key in data){
    formdata.append(key,data[key])
  }
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  let p = await axios.post(url, formdata, config)
  return new Promise((resolve, reject) => {
    p && p.status == 200 ? resolve(p.data) : reject(p)
  })
}

export default {
  get,
  post,
  postFile
}