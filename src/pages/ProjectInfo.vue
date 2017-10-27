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
            <hr style="height:1px;border:none;border-top:1px solid #dfe6ec;" />
            <div>
                <el-button type="info" @click="createProjectEnv()">新建环境</el-button>
            </div>
            <el-row>
                <el-col :span="24">
                    <el-table :data="project.envs" stripe style="width: 100%">
                        <el-table-column label="环境名">
                            <template scope="scope">
                                <p>{{convertEnvCode(scope.row)}}
                                <el-tag type="primary">{{scope.row.envType}}</el-tag>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="主机地址" >
                            <template scope="scope">
                                <p v-for="item in scope.row.servers"><span>{{item.internalIp}}</span></p>
                            </template>
                        </el-table-column>
                        <el-table-column label="域名">
                            <template scope="scope">
                                <p v-for="item in scope.row.domains"><span>{{item}}</span></p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button type="info" size="small" icon="edit"  @click="editProjectEnv(scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" icon="delete" @click="deleteProjectEnv(scope.row.envId)">删除</el-button>
                             </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <modal :is-show="editEnvVisible" @close="editEnvVisible=false" :title="envTitle('修改')">
            <el-form :model="envForm" label-width="100px">
                <el-form-item
                    v-for="(domain, index) in envForm.domains"
                    :label="'域名' + index"
                    :key="index"
                    :prop="'domains.' + index "
                    :rules="{
                      required: true, message: '域名不能为空', trigger: 'blur'
                    }">
                  <el-col :span="12"><el-input v-model="envForm.domains[index]"></el-input></el-col>
                  <el-col :span="12"><el-button style="margin-left: 10px" @click.prevent="removeDomain(index)">删除</el-button></el-col>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addDomain">新增域名</el-button>
                </el-form-item>
                <el-form-item label="主机" prop="servers">
                   <el-select
                    ref="serverSelect2"
                    v-model="envForm.servers"
                    multiple
                    filterable
                    remote
                    :remote-method="remoteMethod">
                    <el-option
                      v-for="item in serverOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editEnv(envForm)">保存</el-button>
            </div>
        </modal>
        <modal :title="envTitle('创建')" :is-show="EnvFormVisible" @close="EnvFormVisible=false">
            <el-form :model="envForm" label-width="100px">
                <el-form-item label="环境名称" prop="envCode">
                    <el-input v-model="envForm.envCode" placeholder="default"></el-input>
                </el-form-item>
                <el-form-item label="环境类型" prop="envType">
                    <el-radio-group v-model="envForm.envType">
                        <el-radio label="DEV">开发</el-radio>
                        <el-radio label="TEST">测试</el-radio>
                        <el-radio label="BETA">预发布</el-radio>
                        <el-radio label="V5">正式V5</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-for="(domain, index) in envForm.domains"
                    :label="'域名' + index"
                    :key="index"
                    :prop="'domains.' + index "
                    :rules="{
                      required: true, message: '域名不能为空', trigger: 'blur'
                    }">
                  <el-col :span="12"><el-input v-model="envForm.domains[index]"></el-input></el-col>
                  <el-col :span="12"><el-button style="margin-left: 10px" @click.prevent="removeDomain(index)">删除</el-button></el-col>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addDomain">新增域名</el-button>
                </el-form-item>
                <el-form-item label="主机" prop="servers">
                   <el-select
                    ref="serverSelect"
                    v-model="envForm.servers"
                    multiple
                    filterable
                    remote
                    :remote-method="remoteMethod">
                    <el-option
                      v-for="item in serverOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createEnv(envForm)">保存</el-button>
            </div>
        </modal>
        <modal title="修改工程" :is-show="saveProjectVisible" @close="saveProjectVisible=false" :show-ok="false" :show-cancel="false">
            <SaveProject :form="saveProjectForm" @onsave="saveProject"></SaveProject>
        </modal>
    </div>
</template>
<script>
    import * as http from '../http'
    import api from '../api'
    import SaveProject from '../components/SaveProject'
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElDialog from "../../node_modules/element-ui/packages/dialog/src/component";
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        data() {
            return {
                projectId: this.$route.params.id,
                project: {
                    name:'',
                    group: {
                        name: ''
                    }
                },
                saveProjectVisible: false,
                saveProjectForm: {},
                managerInfo: {},
                EnvFormVisible: false,
                envForm:{
                    envType: '',
                    envCode: 'default',
                    servers: [],
                    domains: [],
                },
                serverOptions: [],
                isRun: false,
                editEnvVisible: false,
            }
        },
        components: {
            ElCol,
            ElDialog,
            ElButton,
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
            convertEnvCode(data) {
                if (data.envCode !== 'default') {
                    return data.envCode
                }
                switch (data.envType) {
                    case 'DEV':
                        return '开发环境'
                    case 'TEST':
                        return '测试环境'
                    case 'BETA':
                        return '预发布环境'
                    case 'V5':
                        return '正式V5环境'
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
            },
            createProjectEnv() {
                this.EnvFormVisible = true
                this.envForm = {
                    envType: '',
                    envCode: 'default',
                    servers: [],
                    domains: [],
                }
            },
            editProjectEnv(envData) {
                this.envForm.domains = envData.domains
                this.envForm.envId = envData.envId
                this.editEnvVisible = true
                envData.servers.map(item =>{
                    this.serverOptions.push({value: item.serverId, label: item.internalIp })
                })
                this.envForm.servers = []
                envData.servers.map(item => {
                    this.envForm.servers.push(item.serverId)
                })

            },
            deleteProjectEnv(envId) {
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.remove(api.env(envId)).then(data => {
                        this.$notify.success({
                            title: '删除成功'
                        });
                        this.getProjectInfo()
                    })
                })
            },
            envTitle(action) {
                return action + this.project.name + '环境'
            },
            searchServers(kw) {
                http.fetch(api.servers, {
                    'keyword': kw + '*',
                    'dataTake': '65535'
                }).then(res => {
                    this.serverOptions = res.data.dataList.map(item => {
                    return { value: item.id, label: item.internalIp }
                    })
                })
            },
            remoteMethod(query) {
                if (!this.isRun) {
                    this.isRun = true
                    let local = this
                    setTimeout(function () {
                        if (local.$refs['serverSelect'].query.length != 0){
                            query = local.$refs['serverSelect'].query
                        }
                        if (local.$refs['serverSelect2'].query.length != 0){
                            query = local.$refs['serverSelect2'].query
                        }
                        local.searchServers(query)
                        local.isRun = false
                    }, 1000)}
            },
            createEnv(form) {
                http.post(api.envs(this.projectId), form).then(res => {
                    this.$notify.success({
                        title: '保存成功'
                    });
                    this.EnvFormVisible = false
                    this.getProjectInfo()
                })
            },
            editEnv(form) {
                console.log(form)
                http.put(api.env(form.envId), form).then(res => {
                    this.$notify.success({
                        title: '保存成功'
                    });
                    this.editEnvVisible = false
                    this.getProjectInfo()

                })
            },
            addDomain() {
                this.envForm.domains.push('')
            },
            removeDomain(index) {
                this.envForm.domains.splice(index,1)
            }
        },
        created() {
            this.getProjectInfo()
        }
    }

</script>
<style>

  .el-row {
    margin-top: 20px;
  }
  .el-col {
    border-radius: 4px;
  }




</style>
