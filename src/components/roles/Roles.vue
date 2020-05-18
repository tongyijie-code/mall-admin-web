<template>
    <div>
        <!--面包屑插件-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片式图-->
        <el-card >
            <!-- 添加角色按钮-->
            <el-row>
                <el-col class="box-card">
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表-->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列-->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row v-for="(item1, index) in scope.row.children"
                                :key="item1.id"
                                :class="['border-bottom',index === 0?'border-top': '']"
                                class="vcenter">
                            <!-- 一级菜单-->
                            <el-col :span="5">
                                <el-tag closable>{{item1.authName}}</el-tag>
                                <i class=" el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级菜单和三级-->
                            <el-col :span="19">
                                <el-row v-for="(item2, indey) in item1.children"
                                        :key="item2.id" :class="[indey===0?'': 'border-top']"
                                        class="vcenter">
                                    <!-- 二级菜单-->
                                    <el-col :span="6" >
                                        <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                        <i class=" el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级菜单-->
                                    <el-col :span="18">
                                        <el-tag type="warning"
                                                v-for="(item3, indez) in item2.children"
                                                :key="item3.id"
                                                closable
                                                @close="removeRightsById(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 列表-->
                <el-table-column type="index" ></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="角色操作" width="300px">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
                        <el-button size="mini"
                                   type="warning"
                                   icon="el-icon-setting"
                                   @click="showSetRightsDialog(scope.row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--分配权限对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="showSetRightsdialogVisible"
                width="50%"
                @close="resetDefKey">
            <!--树形展示的权限列表-->
            <el-tree
                    :data="rightsList"
                    :props="treeProps"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :default-checked-keys="defKeys" ref="treeRef">

            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showSetRightsdialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="allowRights">确 定</el-button>
             </span>
        </el-dialog>
        <!--编辑角色-->
        <el-dialog
            title="编辑角色"
            v-if="editDialogVisible"
            :visible.sync="editDialogVisible"
            width="50%">
            <!--编辑列表-->
            <el-form :model="userForm" :rules="userRule" ref="userRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="userForm.roleName" ></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="userForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="submitUserRole">确 定</el-button>
             </span>
        </el-dialog>

    </div>
</template>

<script>
    import { getRolesListData, removeRights, getRightsListData, addRights, editUserRole, deleteRoleById} from "../../api/rights";

    export default {
        name: "Roles",
        data() {
            return {
                rolesList: [],
                showSetRightsdialogVisible: false,
                rightsList: [],
                //树状列表
                treeProps: {
                    children: 'children',
                    label: 'authName',
                },
                defKeys: [],
                roleId: '',
                editDialogVisible: false,
                userForm: {
                    roleName: '',
                    roleDesc: '',
                    id: '',
                },
                userRule: {
                    roleName: [{required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}]
                }
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            //获取角色列表
            getRolesList() {
                getRolesListData().then(res => {
                    // console.log(res.data)
                    this.rolesList = res.data
                })
            },
            //根据id删除对应的权限
            removeRightsById(role, rightsId) {
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeRights(role.id, rightsId).then(res => {
                        console.log(res)
                        role.children = res.data
                    })

                    this.$message({type: 'success',message: '删除成功!'});
                }).catch(() => {this.$message({type: 'info',message: '已取消删除'});
                });


            },
            //分配权限对话框
            showSetRightsDialog(role) {
                //获取所有权限
                console.log(role)
                this.roleId = role.id
                console.log(role.id)
                getRightsListData('tree').then(res => {
                    // console.log(res.data)
                    this.rightsList = res.data
                })
                this.getLeafKey(role, this.defKeys)
                this.showSetRightsdialogVisible = true
            },
            //获取三级权限的id，并保存在数组中
            getLeafKey(node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKey(item, arr)
                })
            },
            //对话框关闭，数组变为[]
            resetDefKey() {
                this.defKeys = [];
            },
            //点击确定按钮，提交数据，完成授权
            allowRights() {
                const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
                console.log(keys)
                const idStr = keys.join(',')
                //发送角色授权请求
                addRights(this.roleId, idStr).then(res => {
                    console.log(res)
                    // this.$message.success('分配权限成功')
                    //重新分配角色
                    this.getRolesList()
                    //关闭对话框
                    this.showSetRightsdialogVisible = false
                })

            },
            // 编辑角色
            editRole(role) {
                this.editDialogVisible = true
                this.userForm = role
            },
            //点击确定提交修改
            submitUserRole() {
                this.$refs.userRef.validate(valid => {
                    if (!valid) return
                    const { roleName, roleDesc } = this.userForm
                    editUserRole(this.userForm.id, { roleName, roleDesc })
                        .then( res => {
                        console.log(res)
                            this.$message.success('编辑成功')
                            this.editDialogVisible = false
                    })
                })
            },
            //点击删除角色
            deleteRole(role) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRoleById(role.id).then( res => {
                        console.log(res)
                        this.getRolesList()
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
.el-tag {
    margin: 10px;
}
.border-top {
    border-top: 1px solid #eee
}
.border-bottom {
    border-bottom: 1px solid #eee
}
.vcenter {
    display: flex;
    align-items: center;
}
    .el-card {
        width: 980px;
    }
</style>