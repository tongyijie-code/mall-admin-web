<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 头像 -->
            <div class="avatar-box">
                <img src="~@/assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-area">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!--登录按钮-->
                <el-form-item class="btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="primary" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import { login } from '@/api/user'
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        {min: 3, max: 8, message: '长度在3到5个字节', trigger: "blur"}
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {min: 6, max: 16, message: '长度在6到16个字节', trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            reset() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate((valid) => {
                    //valid是是否满足elementUI的规则条件，满足返回true，进行数据请求 不满足返回
                    if (!valid) return

                    login(this.loginForm).then(res => {
                        const { data } = res
                        //根据客户端的返回信息，用element-ui的message组件，在界面进行提示
                        this.$message(data.meta.msg)
                        if (data.meta.status === 200) {
                            window.sessionStorage.setItem('token', data.data.token)
                            this.$router.push('/home')
                        }
                    })
                })

            }
        }
    }
</script>

<style lang="less" scoped>
.login-container {
    background-color: #2b4b6b;
    height: 100%;

    .login-box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        margin: 0 auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        .avatar-box {
            width: 150px;
            height: 150px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            margin-left: -75px;
            margin-top: -75px;
            background-color: #fff;
            img {
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .login-area {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: 80%;
            margin:auto;
        }
        .btn {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>