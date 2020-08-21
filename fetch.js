import axios from 'axios'

// import store from '../store/store.js'

// import {getUrlString} from '../assets/js/utils';
// import qs from 'qs' 看项目需要

/*
 * 创建异步实力 定义默认参数
 * */
const axiosIns = axios.create({
  //timeout: 5000,
  // withCredentials: true
})
// 设置全局的请求次数，请求的间隙
axiosIns.defaults.retry = 3
axiosIns.defaults.retryDelay = 1000
axiosIns.defaults.baseURL = '/api'
// axiosIns.defaults.custom = {}

// 添加请求拦截器
axiosIns.interceptors.request.use(
  function (config) {
     //console.log(config.config)
    // 请求之前要做的
    // 一些配置项
    if (config.config) {
      for (let item in config.config) {
        config[item] = config.config[item]
      }
    }
    // // 在发送请求之前做些什么
    // // loading
    // let hasLading =
    //   config.config && config.config.hasLoading !== undefined ? config.config.hasLoading : true
    // if (hasLading) Loading.open('加载中...')
    config.headers['focus-token'] = getCookies('focus-token') // 请求头带上token
    config.headers['focus-team-id'] = getCookies('focus-team-id')
    config.headers['focus-lang'] = getCookies('focus-lang')
    // config.headers['Access-Control-Allow-Origin'] = 'https://flow-draw.jdcloud.com'
    // config.headers['Access-Control-Allow-Methods']= 'OPTIONS, GET, PUT, POST, DELETE'
    // config.headers['Content-Type']= 'application/json;charset=utf-8';
    //   config.headers['Access-Control-Allow-Credentials']= 'true';
    // config.headers["Access-Control-Allow-Headers"] =
    //       'Content-Type, Access-Control-Allow-Headers, Access-Control-Request-Headers, ' +
    //       'Access-Control-Request-Method, Authorization, X-Requested-With, User-Agent, Referer, Origin'
return config
  },
  function (error) {
    // 对请求错误做些什么
    Loading.close()
    return Promise.reject(error)
  }
)

// 登录链接
let loginUrl = 'https://me.jdcloud.com/passport/?ReturnUrl='

let currentUrl = window.location.href
axiosIns.interceptors.response.use(
  function (response) {
    // let result = response.data
    // // 关闭loading
    // setTimeout(() => {
    //   Loading.close()
    // }, 300)
    // // let resultData = result.resultData
    // let always =
    //   response.config.config && response.config.config.always
    //     ? response.config.config.always
    //     : false
    // // 网关接口响应失败
    // if (!always && result.resultCode && result.resultCode !== 0) {
    //   let tipErrorMsg = '抱歉,,,,,,系统开小差了~请重试~'
    //   let errorMsg = result.resultMsg ? result.resultMsg : tipErrorMsg
    //   // 未登录
    //
    //   if (result.resultCode === 3) {
    //     // store.commit('USERINFOSTATE', {isLogin: false})
    //     window.location.href =
    //       loginUrl + encodeURIComponent(currentUrl)
    //   } else {
    //     toast({ message: tipErrorMsg })
    //     // 接口异常上报
    //     unionlogErrorReport(
    //       response.config.url,
    //       errorMsg + '(' + result.resultCode + ')'
    //     )
    //   }
    // } else if (always && result.resultCode === 3) {
    //   window.location.href =
    //     loginUrl + encodeURIComponent(currentUrl)
    // }
    if (response.data && response.data.code === 401) { // 401, token失效
      window.location.href=loginUrl+encodeURIComponent(window.location.href)+'&clientId=83f26651552341e9b222300cdc331b60';
    }
    return response
  },
  function (error) {
    // 请求错误时做些事
    // 请求超时的之后，抛出 error.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
    // if (
    //   error.code === 'ECONNABORTED' &&
    //   error.message.indexOf('timeout') !== -1
    // ) {
    //   var config = error.config
    //   config.__retryCount = config.__retryCount || 0
    //   if (config.__retryCount >= config.retry) {
    //     // Reject with the error
    //     // window.location.reload()
    //     return Promise.reject(error)
    //   }
    //   // Increase the retry count
    //   config.__retryCount += 1
    //   // Create new promise to handle exponential backoff
    //   var backoff = new Promise(function (resolve) {
    //     setTimeout(function () {
    //       // console.log('resolve')
    //       resolve()
    //     }, config.retryDelay || 1)
    //   })
    //   return backoff.then(function () {
    //     return axiosIns(config)
    //   })
    // } else {
      return Promise.reject(error)
    // }
  }
)

function defaultErrorFn (error, url) {
  Loading.close()
  if (error.response) {
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
    console.log('errorData', error.response.data)
    console.log('errorStatus', error.response.status)
    console.log('errorHeader', error.response.headers)
    toast({ message: '网络连接异常，请重试~' })
    unionlogErrorReport(url, 'errorData' + error.response.data)
  } else {
    console.log('aip:' + url, error.message)
    toast({ message: '抱歉!!!系统开小差了~~请重试~' })
    unionlogErrorReport(url, '接口错误:' + error.message || '参数错误')
  }
}
 function getCookies(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1){
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// 错误上报
function unionlogErrorReport (url, errorMsg) {
  // 接口异常上报
  try {
    if (typeof window.errorReport === 'function') {
      window.errorReport({
        logLevel: 'FATAL',
        logData: errorMsg,
        errorFileName: '接口名:' + (url || '')
      })
    }
  } catch (e) {
    console.error('异常上报错误:没有找到errorReport方法')
  }
}

export const fetch = {
  post (params, successCb, errorCb) {
    // 序列化入参 网关入参格式
    let paramData = params.data || {}
    let requestData = `reqData=${JSON.stringify(paramData)}`
    return axiosIns({
      method: 'post',
      url: params.url,
      config: params.config || null,
      // data: qs.stringify(data), // 如果 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      data: paramData
    })
      .then(res => {
         successCb && successCb(res)
        // return res.data.resultData
        return res;
      })
      .catch(error => {
        // if (errorCb) {
        //   errorCb(error)
        // } else {
        //   defaultErrorFn(error, params.url)
        // }
        console.log(error)
      })
  },
  get (params, successCb, errorCb) {

    // 序列化入参 网关入参格式
    let paramData = params.data || {}
    let requestData = {
      reqData: JSON.stringify(paramData)
    }
    // get
    return axiosIns({
      method: 'get',
      url: params.url,
      loading: '1',
      config: params.config || null,
      params: requestData
    })
      .then(res => {


          // const l = res.headers['location']
          // location = l

        // let config = params.config
        // // 特殊数据格式
        // if (config && config.always) {
        //   successCb && successCb(res.data)
        //   return
        // }
         successCb && successCb(res)
        return res
      })
      .catch(error => {
        // if (errorCb) {
        //   errorCb(error)
        // } else {
        //   defaultErrorFn(error, params.url)
        // }
        console.log(error)
      })
  },
  mget (url) {
    return axios.get(url)
  },
  spread (cb) {
    return axios.spread(cb)
  },
  all (getArry, cb) {
    axios.all(getArry).then(fetch.spread(cb))
  },


}
