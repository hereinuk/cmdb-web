<template>
    <div>
        <div class="container">
            <div class="box">
                <h2 class="title">工程列表</h2>
                <div class="has-text-right" style="margin: 0px 0px 10px;">
                    <a class="button is-info" @click="showAddGroup">创建组</a>
                    <a class="button is-info" @click="showAddProject">创建工程</a>
                </div>
                <el-collapse accordion>
                    <el-collapse-item v-for="group in groups">
                        <template slot="title">
                            <span style="font-size: 16px;"><i class="fa fa-inbox" style="padding-bottom: 5px; color: #F7BA2A;"></i> <b>{{group.name}}</b></span>
                            <span class="pull-right" style="margin-right: 10px;">
                                <el-button type="text" icon="edit" @click="showChangeGroup(group)"></el-button>
                                <pop-confirm content="确定删除该组？" ok-text="确定" cancel-text="取消" :on-ok="deleteGroup(group.id)">
                                    <el-button type="text" icon="delete"></el-button>
                                </pop-confirm>
                            </span>
                        </template>
                        <el-table :data="group.projects" style="width: 100%" :show-header="false" empty-text="空空如也" @row-click="gotoInfo">
                            <el-table-column align="left">
                                <template scope="scop">
                                    <span style="font-size: 16px;"><i class="fa fa-tasks" style="color: #20A0FF;"></i> {{ scop.row.name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="desc"></el-table-column>
                            <el-table-column>
                                <template scope="scop">
                                    <ShowUserName :userID="scop.row.manager"> </ShowUserName>
                                </template>

                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <modal title="保存组" :width="520" :is-show="saveGroupVisible" transition="fadeDown" @close="saveGroupVisible=false" ok-text="确定"
            cancel-text="取消" :on-ok="saveGroup">
            <el-form ref="form" :model="saveGroupForm" label-position="left" label-width="50px">
                <el-form-item label="组名">
                    <el-input v-model="saveGroupForm.name"></el-input>
                </el-form-item>
            </el-form>
        </modal>
        <modal title="新建工程" :is-show="saveProjectVisible" @close="saveProjectVisible=false" :show-ok="false" :show-cancel="false">
            <SaveProject :form="saveProjectForm" @onsave="saveProject"></SaveProject>
        </modal>
    </div>
</template>
<script>
    import * as http from '../http'
    import api from '../api'
    import SaveProject from '../components/SaveProject'
    import ShowUserName from '../components/ShowUserName.vue'
    export default {
        data() {
            return {
                groups: [],
                saveGroupVisible: false,
                saveGroupForm: {
                    name: "",
                    id: ""
                },
                saveProjectVisible: false,
                saveProjectForm: {}
            }
        },

        components: {
            SaveProject: SaveProject,
            ShowUserName: ShowUserName


        },
        methods: {
            getGroupList() {
                http.fetch(api.projectGroups).then(data => {
                    this.groups = data.data
                })
            },
            showAddGroup() {
                this.saveGroupForm.id = ""
                this.saveGroupForm.name = ""
                this.saveGroupVisible = true
            },
            showChangeGroup(group) {
                this.saveGroupForm.id = group.id
                this.saveGroupForm.name = group.name
                this.saveGroupVisible = true
            },
            saveGroup() {
                if (this.saveGroupForm.id) {
                    http.put(api.projectGroup(this.saveGroupForm.id), {
                        "name": this.saveGroupForm.name
                    }).then(data => {
                        this.$notify.success({
                            title: '保存成功'
                        });
                        this.getGroupList()
                    })
                } else {
                    http.post(api.projectGroups, {
                        "name": this.saveGroupForm.name
                    }).then(data => {
                        this.$notify.success({
                            title: '保存成功'
                        });
                        this.getGroupList()
                    })
                }
            },
            showAddProject() {
                this.saveProjectVisible = true
                this.saveProjectForm = {
                    name: "",
                    groupId: "",
                    describe: "",
                    repoUrl: "",
                    projectType: "",
                    manager: ""
                }
            },
            saveProject() {
                this.saveProjectVisible = false
                this.getGroupList()
            },
            gotoInfo(row) {
                let projectId = row.id
                this.$router.push({
                    path: '/project/' + projectId
                })
            },
            deleteGroup(groupId) {
                let local = this
                return function () {
                    http.remove(api.projectGroup(groupId)).then(data => {
                        local.getGroupList()
                        local.$notify.success({
                            title: '删除成功'
                        });
                    })
                }
            }
        },
        created() {
            this.getGroupList()
        }
    }

</script>
<style>
    .fa {
        vertical-align: middle !important;
    }

</style>
