import axios from 'axios';
import qs from 'qs';

export const CancelToken = axios.CancelToken; // eslint-disable-line

export const Xhr = function (url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
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
  axios.get(parseUrl(url, params), token)
    .then((resp) => {
      resolve(resp.data)
    })
    .catch((err) => {
      reject(err)
    })
});

export const post = (url, data, token) => new Promise((resolve, reject) => {
  axios.post(url, qs.stringify(data), token)
    .then((resp) => {
      resolve(resp)
    })
    .catch((err) => {
      reject(err)
    })
});

// 删除上传图片
export const deleteUploadImg = (data) => {
  const url = '/business/store_themes/deleteThemeImage';
  return new Promise((resolve, reject) => {
    axios.post(
      url, qs.stringify({ imgUrl: data }, { indices: false }), // qs.stringify({ imgUrl: data }),
    ).then((resp) => {
      resolve(resp)
    }).catch((err) => {
      reject(err)
    });
  })
};
