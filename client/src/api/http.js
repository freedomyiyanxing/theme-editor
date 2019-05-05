import axios from 'axios';
import qs from 'qs';

export const CancelToken = axios.CancelToken; // eslint-disable-line

// 获取cookie
const getCookie = (name) => {
  const value = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`).exec(document.cookie)
  return value ? decodeURIComponent(value[1]) : null
}

const csrfToken = getCookie('csrfToken')

/**
 * 上传图片请求的接口
 * @param {} url
 * @param {*} data
 */
export const Xhr = function (url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader('X-Csrf-Token', csrfToken)
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(xhr)
      }
      resolve(JSON.parse(xhr.response))
    };
    xhr.send(data);
  })
};

// 拼接get请求的url
const parseUrl = (url, params) => {
  const str = (params != null) ? Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&`; // eslint-disable-line
    return result
  }, '') : '';
  return `${url}?${str.substr(0, str.length - 1)}`
};

/**
 * get请求
 * @param url 地址
 * @param params 拼接的参数
 * @param token 取消当前请求token
 */
export const get = (url, params, token) => new Promise((resolve, reject) => {
  axios.get(parseUrl(url, params), {
    cancelToken: token,
    headers: { 'X-Csrf-Token': csrfToken },
  })
    .then((resp) => {
      resolve(resp.data)
    })
    .catch((err) => {
      reject(err)
    })
});

/**
 * post请求
 * @param {*} url 地址
 * @param {*} data 数据
 */
export const post = (url, data) => new Promise((resolve, reject) => {
  axios.post(url, qs.stringify(data, { indices: false }), {
    headers: { 'X-Csrf-Token': csrfToken },
  })
    .then((resp) => {
      resolve(resp)
    })
    .catch((err) => {
      reject(err)
    })
});
