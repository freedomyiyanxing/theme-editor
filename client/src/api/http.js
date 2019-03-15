import axios from 'axios';
import qs from 'qs';

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

const parseUrl = (url, params) => {
  const str = (params != null) ? Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&`; // eslint-disable-line
    return result
  }, '') : '';
  return `${url}?${str.substr(0, str.length - 1)}`
};

export const get = (url, params) => new Promise((resolve, reject) => {
  axios.get(parseUrl(url, params))
    .then((resp) => {
      resolve(resp.data)
    }).catch(reject)
});

export const post = (url, data) => new Promise((resolve, reject) => {
  axios.post(url, qs.stringify(data))
    .then((resp) => {
      resolve(resp)
    }).catch((err) => {
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
