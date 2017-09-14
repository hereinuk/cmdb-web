<template>
    <div>
        <nav class="nav has-shadow app-navbar">
            <span class="nav-toggle" v-bind:class="{'is-active':menuActive}" @click="menuTarget">
            <span></span><span></span><span></span></span>
            <div class="nav-left">
                <router-link class="nav-item" to="/">
                    <b class="text-logo">ALOPEX · CMDB</b>
                </router-link>
            </div>
            <div class="nav-right nav-menu">
                <a class="nav-item is-hidden-mobile">Hi, {{userName}}</a>
                <a class="nav-item is-tab is-hidden-mobile" @click="logOut"> <i class="fa fa-sign-out"></i> 退出</a>
            </div>
        </nav>
        <aside class="menu app-sidebar" v-show="menuActive||!isMobile">
            <div class="menu">
                <menus label="">
                    <menu-item icon="desktop" to="/serverlist" :is-active="$route.path=='/'||$route.path=='/serverlist'">服务器列表</menu-item>
                    <menu-item icon="database" to="/rdslist" :is-active="$route.path=='/rdslist'">RDS列表</menu-item>
                    <menu-item icon="tasks" to="/projectgroups" :is-active="$route.path=='/projectgroups'">工程列表</menu-item>
                    <menu-item icon="id-card-o">
                        <span>用户视图</span>
                        <menus slot="sub">
                            <menu-item icon="list" to="/currentuser/servers" :is-active="$route.path=='/currentuser/servers'">服务器管理</menu-item>
                        </menus>
                    </menu-item>
                    <menu-item icon="refresh" to="/syncs" :is-active="$route.path=='/syncs'">数据同步</menu-item>
                </menus>
            </div>
        </aside>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'nav-menu',
        data: function () {
            return {
                menuActive: false,
                isMobile: false
            }
        },
        computed: {
            ...mapGetters(['userName'])
        },
        methods: {
            menuTarget: function () {
                this.menuActive = !this.menuActive
            },
            logOut: function () {
                this.$store.dispatch('setUserToken', '')
            },
            getPathPrefix() {
                return this.$route.path.substr(0, this.$route.path.lastIndexOf('/') + 1)
            }
        },
        beforeMount() {
            const {
                body
            } = document
            const WIDTH = 768
            const RATIO = 3
            let vm = this
            const handler = () => {
                if (!document.hidden) {
                    let rect = body.getBoundingClientRect()
                    vm.isMobile = rect.width - RATIO < WIDTH
                }
            }

            document.addEventListener('visibilitychange', handler)
            window.addEventListener('DOMContentLoaded', handler)
            window.addEventListener('resize', handler)
        }
    }

</script>
<style>
    .app-sidebar {
        position: fixed;
        top: 50px;
        left: 0;
        bottom: 0;
        padding: 0;
        width: 250px;
        min-width: 45px;
        max-height: 100vh;
        height: calc(100% - 50px);
        z-index: 1023;
        background: #fff;
        box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
        overflow-y: auto;
        overflow-x: hidden;
    }

    .menu-list li ul {
        border-left: 0px solid #dbdbdb !important;
        padding-left: 0 !important;
    }

    .app-main {
        padding-top: 50px;
        margin-left: 250px;
        transform: translateZ(0);
    }

    .app-navbar {
        position: fixed !important;
        min-width: 100%;
        z-index: 1024;
    }

    @media screen and (max-width: 765px) {
        .app-main {
            margin-left: 0px;
        }
    }

    .text-logo {
        font-size: 20px;
    }

</style>
