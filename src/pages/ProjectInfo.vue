<template>
    <div class="container">
        <div class="box" v-if="project">
            <div class="pull-right">
                <el-button-group>
                    <el-button type="warning" size="small" @click="showSaveProject">编辑</el-button>
                    <pop-confirm content="确定删除此工程？" ok-text="确定" cancel-text="取消" :on-ok="deleteProject">
                        <el-button type="danger" size="small">删除</el-button>
                    </pop-confirm>
                </el-button-group>
            </div>
            <h2 class="title">工程详情</h2>
            <article>
                <h3 class="small-title">基本信息</h3>
                <ul class="argInfo">
                    <li><b>工程名称：</b> <span>{{project.name}}</span></li>
                    <li><b>归属组：</b><span>{{project.group.name}}</span></li>
                    <li><b>代码仓库：</b><span>{{project.repoUrl}}</span></li>
                    <li><b>工程类型：</b><span>{{getProjectTypeName(project.projectType)}}</span></li>
                    <li><b>工程描述：</b><span>{{project.describe}}</span></li>
                    <li><b>负责人：</b><span>{{managerInfo.name}}</span></li>
                </ul>
            </article>
        </div>
        <modal title="修改工程" :is-show="saveProjectVisible" @close="saveProjectVisible=false" :show-ok="false" :show-cancel="false">
            <SaveProject :form="saveProjectForm" @onsave="saveProject"></SaveProject>
        </modal>
    </div>
</template>
<script>
    import * as http from '../http'
    import api from '../api'
    import SaveProject from '../components/SaveProject'
    export default {
        data() {
            return {
                projectId: this.$route.params.id,
                project: null,
                saveProjectVisible: false,
                saveProjectForm: {},
                managerInfo: {}
            }
        },
        components: {
            SaveProject: SaveProject
        },
        methods: {
            getProjectInfo() {
                http.fetch(api.project(this.projectId)).then(data => {
                    this.project = data.data
                    this.getManagerInfo()
                })
            },
            getManagerInfo() {
                if (this.project.manager) {
                    http.fetch(api.getUserById(this.project.manager)).then(data => {
                        this.managerInfo = data.data
                    })
                }
            },
            getProjectTypeName(projectType) {
                switch (projectType) {
                    case 'DotNet':
                        return '.Net 项目'
                    case 'Java:War':
                        return 'Java（War）项目'
                    case 'Java:Jar':
                        return 'Java（Jar）项目'
                    case 'Java:HttpJar':
                        return 'Java（HttpJar）项目'
                    case 'FrontEnd':
                        return 'Web 前端项目'
                    case 'Python:Flask':
                        return 'Python（Flask）项目'
                    case 'Other':
                        return '其他'
                    case 'IOS':
                        return 'IOS'
                    case 'Android':
                        return 'Android'
                    default:
                        return "未知"
                }
            },
            saveProject() {
                this.saveProjectVisible = false
                this.getProjectInfo()
            },
            showSaveProject() {
                this.saveProjectVisible = true
                this.saveProjectForm = {
                    id: this.project.id,
                    name: this.project.name,
                    groupId: this.project.group.id,
                    describe: this.project.describe,
                    repoUrl: this.project.repoUrl,
                    projectType: this.project.projectType,
                    manager: this.project.manager
                }
            },
            deleteProject() {
                http.remove(api.project(this.projectId)).then(data => {
                    this.$router.push({
                        path: '/projectgroups'
                    })
                    this.$notify.success({
                        title: '删除成功'
                    });
                })
            }
        },
        created() {
            this.getProjectInfo()
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
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
        background-color: #58B7FF;
        padding: 10px;
        color: #FFF;
    }

</style>
