import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import * as types from '../store/mutation-types'
import config from '../config'
import cookie from '../assets/js/cookie_operator'
// components
import Hello from 'pages/Hello'
import ServerList from 'pages/ServerList'
import ServerInfo from 'pages/ServerInfo'
import ServerManageForCurrentUser from 'pages/ServerManageForCurrentUser'
import RdsList from 'pages/RdsList'
import RdsInfo from 'pages/RdsInfo'
import ProjectGroupList from 'pages/ProjectGroupList'
import ProjectInfo from 'pages/ProjectInfo'
import SyncList from 'pages/SyncList'

Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        component: ServerList
    }, {
        path: '/hello',
        component: Hello
    }, {
        path: '/serverlist',
        component: ServerList
    }, {
        path: '/server/:id',
        component: ServerInfo
    }, {
        path: '/currentuser/servers',
        component: ServerManageForCurrentUser
    }, {
        path: '/rdslist',
        component: RdsList
    }, {
        path: '/rdsinfo/:id',
        component: RdsInfo
    }, {
        path: '/projectgroups',
        component: ProjectGroupList
    }, {
        path: '/project/:id',
        component: ProjectInfo
    }, {
        path: '/syncs',
        component: SyncList
    }]
})

router.beforeEach((to, from, next) => {
    if (store.state.account.token) {
        next()
    } else {
        if (to.query.accesstoken) {
            store.dispatch('setUserToken', to.query.accesstoken)
            next()
        } else if (cookie.getCookie("token")) {
            store.dispatch('setUserToken', cookie.getCookie("token"))
            next()
        } else {
            let s = `${config.authServerHost}/login?appid=${config.appid}&callback=${encodeURI(config.localHost + '/%23' + to.fullPath)}`;
            location.href = s;
        }
    }
})



export default router;
