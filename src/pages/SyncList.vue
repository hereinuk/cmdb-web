<template>
    <div class="container">
        <div class="box">
            <h2 class="title">数据同步</h2>
            <div>
                <el-button type="primary" @click="syncServer">同步阿里云ECS</el-button>
                <el-button type="success" @click="syncRDS">同步阿里云RDS</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as http from '../http'
    import api from '../api'
    export default {
        methods: {
            syncServer(params) {
                http.fetch(api.syncServer).then(data => {
                    this.$notify.success({
                        title: '开始异步同步'
                    });
                })
            },
            syncRDS(params) {
                http.fetch(api.syncRDS).then(data => {
                    this.$notify.success({
                        title: '开始异步同步'
                    });
                })
            },
            syncProject(params) {
                http.fetch(api.syncProject).then(data => {
                    this.$notify.success({
                        title: '开始异步同步'
                    });
                })
            }
        }
    }

</script>
