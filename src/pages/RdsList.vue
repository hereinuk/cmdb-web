<template>
    <div class="container">
        <div class="box">
            <h2 class="title">RDS列表</h2>
            <div class="level-item is-pulled-right">
                <p class="control has-addons">
                    <input class="input" type="text" placeholder="Address/Name/Id" v-model="searchKeyword" title="可使用通配符 *">
                    <button class="button" @click="search">Search</button>
                </p>
            </div>
            <div class="responsive">
                <div class="table-container">
                    <el-table :data="serverList" @row-click="gotoInfo">
                        <el-table-column prop="instanceId" label="DBInstanceId"></el-table-column>
                        <el-table-column prop="address" label="Address"></el-table-column>
                        <el-table-column prop="description" label="DBdes"></el-table-column>
                        <el-table-column prop="type" label="DBType"></el-table-column>
                        <el-table-column prop="status" label="Status"></el-table-column>
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
        name: 'rdslist',
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
            getRdsList() {
                http.fetch(api.rdss, {
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
                this.getRdsList()
            },
            gotoInfo: function (row) {
                console.log(row)
                let id = row.dataBaseId
                this.$router.push({
                    path: "/rdsinfo/" + id
                })
            },
            search: function () {
                this.pageIndex = 1
                this.getRdsList()
            }

        },
        created() {
            this.getRdsList()
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
