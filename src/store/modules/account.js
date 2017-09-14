import * as types from '../mutation-types'
import * as http from '../../http'
import api from '../../api'
import config from '../../config'
import cookie from '../../assets/js/cookie_operator'

export default {
    state: {
        user: null,
        token: ""
    },
    getters: {
        userName: state => {
            return state.user ? state.user.name : ''
        }
    },
    mutations: {
        [types.Load_USER](state, user) {
            state.user = user
        },

        [types.Load_Token](state, token) {
            state.token = token
        }
    },
    actions: {
        setUserToken(context, token) {
            context.commit(types.Load_Token, token)
            if (token) {
                // 用户登陆
                http.post(api.getUserByToken, {
                    accesstoken: token
                }).then(res => {
                    let user = res.data.data
                    if (user) {
                        context.commit(types.Load_USER, user)
                        cookie.setCookie("token", token)
                    } else {
                        context.dispatch('setUserToken', '')
                    }
                })
            } else {
                // 用户退出
                cookie.clearCookie("token")
                context.commit(types.Load_USER, null)
                location.href = config.authServerHost + '/logout?appid=' + config.appid
            }
        }
    }
}
