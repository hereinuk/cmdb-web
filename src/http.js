import axios from 'axios'
import store from 'store'
import { Notification } from 'element-ui';

axios.defaults.timeout = 8000;

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.account.token) {
            config.headers.Authorization = `${store.state.account.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    store.dispatch('setUserToken', '')
                    break;
                case 400:
                    Notification.warning({
                        title: "操作失败",
                        message: error.response.data.message
                    })
                    break;
            }

        } else {
            Notification.error({
                title: 'ERROR',
                message:"网络问题或服务器内部错误"
            });
        }
        return error.response ? Promise.reject(error.response.data) : Promise.reject(error)
    });

export default axios;

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}


/**
 * delete 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function remove(url) {
    return new Promise((resolve, reject) => {
        axios.delete(url)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}
