<template>
    <div class="container">
        <div class="box">
            <h2 class="title">服务器管理</h2>
            <el-tabs v-model="tabSelect">
                <el-tab-pane label="上交" name="handin"></el-tab-pane>
                <el-tab-pane label="认领" name="claim"></el-tab-pane>
            </el-tabs>
            <div class="level-item is-pulled-left">
                <button class="button is-info is-disabled" v-if="tabSelect=='claim'&&!selectCount">认领</button>
                <button class="button is-info is-disabled" v-if="tabSelect=='handin'&&!selectCount">上交</button>
                <pop-confirm content="是否确定认领？" icon="question-circle-o" v-if="tabSelect=='claim'&&selectCount" :on-ok="updateServerManager">
                    <button class="button is-info">认领</button>
                </pop-confirm>
                <pop-confirm content="是否确定上交？" icon="question-circle-o" v-if="tabSelect=='handin'&&selectCount" :on-ok="updateServerManager">
                    <button class="button is-info">上交</button>
                </pop-confirm>
            </div>
            <div class="level-item is-pulled-right">
                <p class="control has-addons">
                    <input class="input" type="text" placeholder="IP/HostName/Remark" v-model="searchKeyword" title="可使用通配符 *">
                    <button class="button" @click="search">Search</button>
                </p>
            </div>
            <div class="responsive">

                <div class="table-container">
                    <el-table :data="serverList" @selection-change="selectItemsChange">
                        <el-table-column type="selection" width="48"></el-table-column>
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
        name: 'serverclaim',
        data() {
            return {
                serverList: [],
                totalCount: 0,
                takeCount: 20,
                skipCount: 0,
                searchKeyword: "",
                selectItems: [],
                tabSelect: "handin"
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
            },
            selectCount: function () {
                return this.selectItems.length
            }
        },
        methods: {
            getServerList() {
                http.fetch(api.currentUserServer, {
                    "dataTake": this.takeCount,
                    "dataSkip": this.skipCount,
                    "keyword": this.searchKeyword,
                    "hasManager": this.tabSelect == 'handin'
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
            gotoInfo: function (id) {
                this.$router.push({
                    path: "/server/" + id
                })
            },
            search: function () {
                this.pageIndex = 1
                this.getServerList()
            },
            selectItemsChange: function (selection) {
                this.selectItems = selection
            },
            updateServerManager: function () {
                let serverIds = []
                for (let server of this.selectItems) {
                    serverIds.push(server.id)
                }
                http.post(api.currentUserServer, {
                    "serverIds": serverIds,
                    "isClaim": this.tabSelect == "claim"
                }).then(data => {
                    this.pageIndex = 1
                    this.searchKeyword = ""
                    this.getServerList()
                })
            }
        },
        created() {
            this.getServerList()
        },
        watch: {
            tabSelect: function () {
                this.pageIndex = 1
                this.searchKeyword = ""
                this.getServerList()
            }
        }
    }

</script>
<style>
    .table-container {
        margin: 10px 0;
    }

</style>
