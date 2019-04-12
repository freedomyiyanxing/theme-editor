import axios from 'axios';
import qs from 'qs';

export const CancelToken = axios.CancelToken; // eslint-disable-line

// 获取cookie
const getCookie = (name) => {
  const value = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`).exec(document.cookie)
  return value ? decodeURIComponent(value[1]) : null
}

const csrfToken = getCookie('csrfToken')

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

// $(document).ajaxSend(function(event, xhr, settings) {
//   if (!settings.crossDomain && !/^(GET|HEAD|TRACE|OPTIONS)$/i.test(settings.type)) {
//     var csrfToken = getCookie("csrfToken");
//     if (csrfToken != null) {
//       xhr.setRequestHeader("X-Csrf-Token", csrfToken);
//     }
//   }
// });
// // 获取Cookie
// function getCookie(name) {
//   if (name != null) {
//     var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)")
// .exec(document.cookie);
//     return value ? decodeURIComponent(value[1]) : null;
//   }
// }

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

export const post = (url, data) => new Promise((resolve, reject) => {
  axios.post(url, qs.stringify(data), {
    headers: { 'X-Csrf-Token': csrfToken },
  })
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
