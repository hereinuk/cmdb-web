<template>
    <div class="container">
        <div class="box">
            <h2 class="title">Rds详情</h2>
            <article>
                <h3 class="small-title">基本信息</h3>
                <ul class="argInfo">
                    <li><b>主机名：</b> <span>{{rds.address}}</span></li>
                    <li><b>描述：</b><span>{{rds.description}}</span></li>
                    <li><b>管理者：</b><span>{{rds.manager?rds.manager.name:""}}</span></li>
                    <li><b>IDC：</b><span>{{getIdeName(rds.idc)}}</span></li>
                    <li><b>IDC 可用区：</b><span>{{rds.zone}}</span></li>
                    <li><b>当前状态：</b><span v-bind:class="{
                        'text-success':(rds.status == 'running')
                    }">{{rds.status}}</span></li>
                    <li><b>创建时间：</b><span>{{getTime(rds.creationTime)}}</span></li>
                    <li><b>过期时间：</b><span>{{getTime(rds.expiredTime)}}</span></li>
                </ul>
                <h3 class="small-title">配置信息</h3>
                <ul class="argInfo">
                    <li><b>DatabaseType：</b><span>{{rds.type}}</span></li>
                    <li><b>CPU：</b><span>{{rds.cpu}} 个</span></li>
                    <li><b>内存：</b><span>{{rds.memory}} M</span></li>
                    <li><b>Storage：</b><span>{{rds.storage}} G</span></li>
                    <li><b>IOPS：</b><span>{{rds.iops}} </span></li>
                    <li><b>Comment：</b><span>{{rds.remark}}</span></li>
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
                rdsId: this.$route.params.id,
                rds: {}
            }
        },
        methods: {
            getServerInfo: function () {
                http.fetch(api.rds(this.rdsId)).then(data => {
                    this.rds = data.data
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
