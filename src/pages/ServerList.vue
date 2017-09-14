<template>
    <div class="container">
        <div class="box">
            <h2 class="title">服务器列表</h2>
            <div class="level-item is-pulled-right">
                <p class="control has-addons">
                    <input class="input" type="text" placeholder="IP/HostName/Remark" v-model="searchKeyword" title="可使用通配符 *">
                    <button class="button" @click="search">Search</button>
                </p>
            </div>
            <div class="responsive">
                <div class="table-container">
                    <el-table :data="serverList" @row-click="gotoInfo">
                        <el-table-column prop="hostName" label="主机名"></el-table-column>
                        <el-table-column prop="internalIp" label="内网IP"></el-table-column>
                        <el-table-column prop="externalIp" label="外网IP"></el-table-column>
                        <el-table-column prop="osPlatform" label="操作系统"></el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                    </el-table>
                </div>
                <pagination :total="totalCount" align="left" layout="pager,total" :page-size="pageSize" :change="paginationChange" :current="pageIndex"></pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import * as http from '../http'
    import api from 'api'
    export default {
        name: 'serverlist',
        data() {
            return {
                serverList: [],
                totalCount: 0,
                takeCount: 20,
                skipCount: 0,
                searchKeyword: ""
            }
        },
        computed: {
            pageSize: function () {
                return this.takeCount
            },
            pageIndex: {
                get: function () {
                    return this.skipCount / this.takeCount + 1
                },
                set: function (val) {
                    this.skipCount = (val - 1) * this.takeCount
                }
            }
        },
        methods: {
            getServerList() {
                http.fetch(api.servers, {
                    "dataTake": this.takeCount,
                    "dataSkip": this.skipCount,
                    "keyword": this.searchKeyword
                }).then(data => {
                    this.serverList = data.data.dataList
                    this.totalCount = data.data.totalCount
                    this.skipCount = data.data.dataSkip
                    this.takeCount = data.data.dataTake
                })
            },
            paginationChange: function (page) {
                this.pageIndex = page
                this.getServerList()
            },
            gotoInfo: function (row) {
                let id = row.id
                this.$router.push({
                    path: "/server/" + id
                })
            },
            search: function () {
                this.pageIndex = 1
                this.getServerList()
            }

        },
        created() {
            this.getServerList()
        },
        watch: {

        }
    }

</script>
<style>
    .table-container {
        margin: 10px 0;
    }

</style>
