<template>

    <div>
        <!--面包屑插件-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片-->
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容"
                              class="input-with-select"
                              v-model="queryInfo.query"
                              clearable @clear="_getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格数据-->
            <el-table
                    :data="userlist"
                    style="width: 100%" border stripe>
                <el-table-column
                        type="index" label="#">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话"
                    width="180">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <!-- 操作状态 -->
                <el-table-column
                        label="状态">
                    <template v-slot="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                active-color="#13ce66"
                                inactive-color="#ff4949" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <!-- 编辑-->
                        <el-button type="primary" icon="el-icon-edit" size="small"  @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除-->
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 设置-->
                        <el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="small" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!--添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%"
            @close="resetForm">
            <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                 </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser(editForm.id)">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户对话框-->
        <el-dialog
                title="修改"
                :visible.sync="editDialogVisible"
                width="30%" @close="editFormClose">
            <el-form :model="editForm" :rules="addRules" ref="editRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
             </span>
        </el-dialog>
        <!--分配角色对话框-->
        <el-dialog
                title="分配角色"
                :visible.sync="roleDialogVisible"
                width="50%" @close="setRoleDialogClose">
            <div>
                <p class="userInfo">当前的用户：{{userInfo.username}}</p>
                <p class="userInfo">当前的角色：{{userInfo['role_name']}}</p>
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="roleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getUserList, changeStatus, addUserInfo, getUserById, commitEdit, removeUser, setUserRole } from '@/api/user'
    import { getRolesListData } from '@/api/rights'
    import { isEmail, isMobile } from '@/utils/validator'
    export default {
        name: "UserList",
        data() {
            const checkEmail = (rule, value ,callback) => {
                if (isEmail(value)) {
                    return callback()
                }
                callback(new Error('请输入合法邮箱'))
            }
            const checkMobile = (rule, value ,callback) => {
                if (isMobile(value)) {
                    return callback()
                }
                callback(new Error('请输入合法手机号'))
            }
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                userlist: [],
                total: 0,
                isOpen: false,
                addDialogVisible: false, //对话框显示?
                //添加对象
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //规则
                addRules:{
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度为3-10个字符', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '密码长度为6-12位', trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入手机号',trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}] ,
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur'}]
                },
                editDialogVisible: false,
                //用户信息
                editForm: {},
                //角色对话框显示
                roleDialogVisible: false,
                userInfo: '',
                rolesList: [],
                //被选中的角色id
                selectedRoleId: ''
            }
        },
        created() {
            this._getUserList()
        },
        methods: {
            _getUserList() {
                getUserList(this.queryInfo).then(res => {
                    // console.log(res)
                    this.userlist = res.data.users
                    this.total = res.data.total
                })
            },
            //监听pagesize改变，调用接口
            handleSizeChange(newNumber) {
                this.queryInfo.pagesize = newNumber
                this._getUserList()
            },
            //监听页码改变，将其赋值给参数对象，重新调用数据请求
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this._getUserList()
            },
            //监听switch开关状态改变
            userStateChange(userinfo) {
                // console.log(userinfo)
                changeStatus(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
                    console.log(res)
                })
            },
            query() {
                this._getUserList()
            },

            //重置表单
            resetForm() {
                this.$refs.addRef.resetFields()
            },
            addUser() {
                this.$refs.addRef.validate(valid => {
                    if (!valid) return
                    //校验成功，提交添加数据
                    addUserInfo(this.addForm).then(res => {
                        console.log(res)
                        //提交成功，请求数据，重新展示
                        this._getUserList()
                        this.addDialogVisible = false
                    })
                })

            },
            //是否显示编辑对话框
            showEditDialog(id) {
                this.editDialogVisible = true
                getUserById(id).then(res => {
                    this.editForm = res.data

                })
            },
            editFormClose() {
                this.$refs.editRef.resetFields()
            },
            //点击提交确定修改
            editUserInfo() {
                //预验证，数据正确在提交
                this.$refs.editRef.validate(valid => {
                    if (!valid) return
                    //根据api方法修改数据
                    commitEdit(
                        this.editForm.id,
                        {email: this.editForm.email, mobile: this.editForm.mobile}
                    ).then(res => {
                        this._getUserList() //刷新数据列表
                        this.editDialogVisible = false //关闭对话框
                        this.$message.success('更新成功')
                    })
                })

            },
            //点击删除
            removeUserById(id) {
                this.$confirm('此操作永久删除该用户，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    removeUser(id).then(res => {
                        this._getUserList()
                        this.$message.success('删除成功')
                    })
                }).catch(res => {
                    console.log(res)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //分配角色
            setRole(role) {
                this.roleDialogVisible = true
                this.userInfo = role
                console.log(role)
                //获取角色信息
                getRolesListData().then( res => {
                    this.rolesList = res.data
                    // console.log(res.data)
                })

            },
            //点击确定按钮分配角色
            saveRoleInfo() {
                //判断是否选中，选中进行保存，没选中就提示
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择角色')
                }
                setUserRole(this.userInfo.id, this.selectedRoleId).then(res => {
                    console.log(res)
                    this.$message.success('分配角色成功')
                    //重新展示
                    this._getUserList()
                    this.roleDialogVisible = false
                })


            },
             //  关闭对话框重置
            setRoleDialogClose() {
                this.userInfo.id = ''
                this.selectedRoleId = ''
            }

        }
    }
</script>

<style scoped>
.userInfo {
    font-size: 15px;
    color: #666;
    margin-bottom: 10px;
}
</style>