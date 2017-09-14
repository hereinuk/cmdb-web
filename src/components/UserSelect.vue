<template>
    <el-select v-model="selectUser" filterable remote placeholder="请输入人员姓名" :remote-method="remoteMethod" :loading="loading">
        <el-option v-for="user in searchUserList" :key="user.id" :label="user.name" :value="user.id">
        </el-option>
    </el-select>
</template>

<script>
    import SaveProject from '../components/SaveProject'
    import * as http from '../http'
    import api from '../api'
    export default {
        data: function () {
            return {
                searchUserList: [],
                loading: false,
                hasInitLoad: false
            }
        },
        props: {
            value: ""
        },
        computed: {
            selectUser: {
                // getter
                get: function () {
                    this.getUserInfo()
                    return this.value
                },
                // setter
                set: function (newValue) {
                    this.$emit('input', newValue)
                }
            }
        },
        methods: {
            searchUser(kw) {
                http.fetch(api.searchUser, {
                    "keyword": kw
                }).then(data => {
                    this.loading = false
                    this.searchUserList = data.data.searchData
                })
            },
            remoteMethod(query) {
                this.loading = true;
                //console.log(query)
                this.searchUser(query)
            },
            getUserInfo() {
                if (this.value && this.searchUserList.filter(u => u.id == this.value).length == 0 && !this.hasInitLoad) {
                    http.fetch(api.getUserById(this.value)).then(data => {
                        this.searchUserList = [data.data]
                        this.hasInitLoad = true
                    })
                }
            }
        }
    }

</script>

<style>


</style>
