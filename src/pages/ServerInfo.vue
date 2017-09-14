<template>
    <div class="container">
        <div class="box">
            <h2 class="title">服务器详情</h2>
            <article>
                <h3 class="small-title">基本信息</h3>
                <ul class="argInfo">
                    <li><b>主机名：</b> <span>{{server.hostName}}</span></li>
                    <li><b>描述：</b><span>{{server.remark}}</span></li>
                    <li><b>管理者：</b><span>{{server.manager?server.manager.name:""}}</span></li>
                    <li><b>IDC：</b><span>{{getIdeName(server.idc)}}</span></li>
                    <li><b>IDC 可用区：</b><span>{{server.idcZone}}</span></li>
                    <li><b>当前状态：</b><span v-bind:class="{
                        'text-success':(server.status == 'running')
                    }">{{server.status}}</span></li>
                    <li><b>创建时间：</b><span>{{getTime(server.creationTime)}}</span></li>
                    <li><b>过期时间：</b><span>{{getTime(server.expiredTime)}}</span></li>
                </ul>
                <h3 class="small-title">配置信息</h3>
                <ul class="argInfo">
                    <li><b>操作系统：</b><span>{{server.osName}}</span></li>
                    <li><b>CPU：</b><span>{{server.cpu}} 个</span></li>
                    <li><b>GPU：</b><span>{{server.gpu}} 个</span></li>
                    <li><b>内存：</b><span>{{server.memory}} M</span></li>
                    <li><b>磁盘大小：</b><span>{{server.disk}} G</span></li>
                    <li><b>内网IP：</b><span>{{server.internalIp}}</span></li>
                    <li><b>外网IP：</b><span>{{server.externalIp}}</span></li>
                </ul>
            </article>
        </div>
    </div>
</template>
<script>
    import * as http from '../http'
    import api from '../api'
    export default {
        data() {
            return {
                serverId: this.$route.params.id,
                server: {}
            }
        },
        methods: {
            getServerInfo: function () {
                http.fetch(api.server(this.serverId)).then(data => {
                    this.server = data.data
                })
            },
            getIdeName(ideCode) {
                switch (ideCode) {
                    case "aliyun":
                        return "阿里云"
                    default:
                        return ideCode
                }
            },
            getTime(tiemstamp) {
                let date = new Date(tiemstamp)
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()
                let hours = date.getHours()
                let minutes = date.getMinutes()


                return year + "-" + (month < 10 ? "0" + month : month) + "-" +
                    (day < 10 ? "0" + day : day) + " " + (hours < 10 ? "0" + hours : hours) +
                    ":" + (minutes < 10 ? "0" + minutes : minutes)
            }
        },
        created: function () {
            this.getServerInfo()
        }
    }

</script>
<style>
    .argInfo li {
        margin: 10px 0px;
        font-size: 15px;
        padding-left: 10px;
    }

    .argInfo li b {
        margin-right: 10px;
    }

    .small-title {
        margin-top: 40px;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
        background-color: #58B7FF;
        padding: 10px;
        color: #FFF;
    }

    .text-success {
        color: #6cc788;
    }

</style>
