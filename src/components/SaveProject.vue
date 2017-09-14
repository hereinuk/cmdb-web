<template>
    <div>
        <el-form :model="form" label-width="100px" :rules="rules" ref="save">
            <el-form-item label="工程名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="归属组" prop="groupId">
                <el-select v-model="form.groupId" placeholder="请选择归属组" @visible-change="selectVisibleChange">
                    <el-option :label="group.name" :value="group.id" v-for="group in groups"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="代码仓库" prop="repoUrl">
                <el-input v-model="form.repoUrl"></el-input>
            </el-form-item>
            <el-form-item label="工程类型" prop="projectType">
                <el-select v-model="form.projectType" placeholder="请选择工程类型">
                    <el-option label=".Net 项目" value="DotNet"></el-option>
                    <el-option label="Java（War）项目" value="Java:War"></el-option>
                    <el-option label="Java（Jar）项目" value="Java:Jar"></el-option>
                    <el-option label="Java（HttpJar）项目" value="Java:HttpJar"></el-option>
                    <el-option label="Web 前端项目" value="FrontEnd"></el-option>
                    <el-option label="Python（Flask）项目" value="Python:Flask"></el-option>
                    <el-option label="Android" value="Android"></el-option>
                    <el-option label="IOS" value="IOS"></el-option>
                    <el-option label="其他" value="Other"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="负责人">
                <UserSelect v-model="form.manager"></UserSelect>
            </el-form-item>
            <el-form-item label="工程描述">
                <el-input type="textarea" v-model="form.describe"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveProject">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import * as http from '../http'
    import api from '../api'
    import UserSelect from "./UserSelect"
    export default {
        data() {
            return {
                groups: [],
                rules: {
                    name: [{
                        required: true,
                        message: '请输入工程名称',
                        trigger: 'blur'
                    }],
                    projectType: [{
                        required: true,
                        message: '请选择工程类型',
                        trigger: 'change'
                    }],
                    groupId: [{
                        required: true,
                        type: "number",
                        message: '请选择归属组',
                        trigger: 'change'
                    }],
                    repoUrl: [{
                        required: false,
                        type: "url",
                        message: '代码仓库格式不正确',
                        trigger: 'blur'
                    }],
                }
            }
        },
        components: {
            UserSelect: UserSelect
        },
        props: {
            form: {
                name: "",
                groupId: "",
                describe: "",
                repoUrl: "",
                projectType: "",
                manager: ""
            }
        },
        methods: {
            getGroupSelect() {
                http.fetch(api.selectProjectGroup).then(data => {
                    this.groups = data.data
                })
            },
            saveProject() {
                this.$refs["save"].validate((valid) => {
                    if (valid) {
                        if (this.form.id) {
                            http.put(api.project(this.form.id), this.form).then(data => {
                                this.$notify.success({
                                    title: '保存成功'
                                });
                                this.$emit('onsave')
                            })
                        } else {
                            http.post(api.projects, this.form).then(data => {
                                this.$notify.success({
                                    title: '保存成功'
                                });
                                this.$emit('onsave')
                            })
                        }
                    } else {
                        return false;
                    }
                });

            },
            selectVisibleChange(rel) {
                if (rel) {
                    this.getGroupSelect()
                }
            }
        },
        created() {
            this.getGroupSelect()
        }
    }

</script>
